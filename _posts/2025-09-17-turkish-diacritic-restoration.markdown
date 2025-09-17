---
layout: post
title:  "The Deceptively Complex World of Turkish Diacritics: A Neural Network Journey"
date:   2025-09-17 18:00:01
categories: turkish neural network github diacritics macos app swift python
---

*How adding a few dots and curves to letters became a 3.7‑million‑parameter adventure*

---

## The "Simple" Problem

Picture this: you're reading Turkish text where someone forgot to add the special characters. "Turkiye" instead of "Türkiye", "ogrenci" instead of "öğrenci." Seems simple enough, right? Just add back the missing dots and curves – how hard could it be?

Well, buckle up. What looks like a search‑and‑replace task quickly becomes a journey through morphology, orthography, GPU quirks, and model design.

## What Are Diacritics, Anyway?

*Diacritics* are the marks you see on letters that change their sound or meaning - like `é`, `ç`, or `ö`. In Turkish, six Latin letters have diacritic counterparts: `c↔ç`, `g↔ğ`, `i↔ı`, `o↔ö`, `s↔ş`, `u↔ü`. Missing a diacritic is not just a cosmetic issue: it can turn a word into a different word ("yasam" → "yaşam"), or a non‑word into a valid word ("semşiye" → "şemsiye"). That means you need **context** to decide what the right letter should be.

## Origin Story: From a Mac App Idea to a Deep Dive

This project didn’t start as a research exercise. I originally just wanted to build a **macOS app** that restores diacritics naively - a little utility I could run on local text. While searching for inspiration, I found [Emre Sevinç’s blog post on Turkish deasciification](https://ileriseviye.wordpress.com/tag/turkish-deasciifier/), which pointed to [his own Python implementation of the classic pattern‑based approach](https://github.com/emres/turkish-deasciifier), and also gathered the **historical context** of the problem. That post also name‑checked **neural networks**.

Cue the curiosity. If rule‑based tools could already do well, what could a modern neural network approach do on a standard laptop? After vibe coding a macOS application in Swift ([https://github.com/armish/TurkishDeasciifier](https://github.com/armish/TurkishDeasciifier)), I decided to vibe‑code my way into neural networks and see how far I could push it.

For the impatient, here is the repository that has all the relevant materials (code, models, more details): [https://github.com/armish/nokta-ai](https://github.com/armish/nokta-ai).

## A 15‑Year Head Start: Rule‑Based Deasciifiers

Long before GPUs were in the picture, researchers built **pattern‑based deasciifiers** that worked surprisingly well on CPUs: for example, **Deniz Yüret’s Emacs Lisp Turkish mode** (one of the earliest practical tools). These systems were **deterministic, blazing fast, and accurate (\~97%)** for everyday use. So why revisit the problem? Because by the 2020s, the landscape shifted: M‑series laptops with a GPU‑like Metal backend, cheap on‑demand cloud GPUs, and AI copilots that accelerate coding. What used to take months could plausibly happen over a weekend.

## Stepwise Development: Wrestling With Neural Nets

My path to a strong model was iterative, and each step fixed a very specific pain point:

1. **Naïve BiLSTM**: A basic character‑level recurrent model. Result: underwhelming accuracy, especially on ambiguous words.

2. **Mask non‑diacritic characters**: Why waste capacity predicting diacritics for letters like `m` or `t`? Masking **reduced the output space** and **cut false positives**. This was a crucial simplifying step *before* playing with attention.

3. **Add an attention layer**: Attention let the model focus on relevant context (prefixes/suffixes, neighboring words). Helpful, but not a silver bullet.

4. **Balanced sampling + weighted loss**: Some diacritics are rare. Without balancing and a **weighted BCE loss**, the model under‑predicted them. Oversampling + loss weights produced a **big jump** in accuracy.

5. **Reduce to 6 characters (lowercase normalization)**: I normalized the corpus to lowercase and trained the model to decide **only** among the six diacritic pairs. After inference, I **restored case** using explicit Turkish rules (including the dotted/dotless `i`). This **massively simplified** learning.

6. **Special handling for the dotted and dotless i**: English uppercases `i` to `I`. Turkish does something different: lowercase `i` becomes uppercase `İ` (dotted I) and lowercase `ı` (dotless i) becomes uppercase `I`. That means `istanbul` uppercased correctly is `İSTANBUL`, not `ISTANBUL`. Words like `ışık` (light) and `işik` are different words. I normalized everything to lowercase for training, then restored case in post-processing with explicit rules for `i/İ/ı/I`. This avoided teaching the network case rules and eliminated one of the biggest error sources.

7. **Scale on a GPU**: With the fundamentals fixed, increasing the **context window**, **hidden size**, and especially the **dataset size** on an **A100** unlocked near‑SOTA accuracy.

Each tweak felt like peeling away a layer of complexity until things finally clicked.

## The Architecture That Finally Worked (High‑Level)

* **Backbone:** 2‑layer **BiLSTM** with a modest **hidden state** per direction.
* **Attention:** lightweight multi‑head self‑attention to let the model “peek” farther than the recurrent state.
* **Context window:** up to **96** characters in the A100 run – enough for word boundaries and morphology.
* **Output heads:** six binary classifiers (one per diacritic pair), gated by the **mask** so only eligible characters are considered.
* **Training:** **balanced sampling**, **weighted loss**, lowercase normalization, explicit **post‑processing** for Turkish casing rules (especially `i/İ/ı/I`).

This blend kept the model **small enough to ship** (4.4–16 MB) while retaining the context it needs to disambiguate tricky cases.


## Datasets & Test Files

To keep things honest across domains, I evaluated on three very different test sets:

* **`aysnrgenc_turkishdeasciifier_test.txt`** - a subset derived from [Aysenur Genç’s implementation](https://github.com/aysnrgenc/turkishdeasciifier).
* **`llm_random_test.txt`** - random Turkish text generated by ChatGPT (noisy, synthetic).
* **`vikipedi_test.txt`** - long, stitched Turkish Wikipedia articles (cleaner, formal, long‑context).

For evaluation, I focused on two **meaningful** metrics:

* **Diacritic‑specific accuracy** - *did it restore where it needed to?*
* **Overall word accuracy** - *did it avoid changing words that were already correct?*


## Laptop vs. GPU: Training Realities

| Environment                      | Context window | Hidden size | Batch size | Train set | Epochs | Runtime | Overall word accuracy | Diacritic-specific accuracy | Model size |
| -------------------------------- | -------------: | ----------: | ---------: | --------: | -----: | ------- | --------------------: | --------------------------: | ---------: |
| **M1 Pro (overnight prototype)** |             20 |         128 |         16 |    10,000 |     50 | \~10 h  |                83–93% |                      82–92% |     4.4 MB |
| **A100 GPU (small config)**      |             20 |         128 |         32 |   100,000 |     50 | <10 h   |                 \~99% |                       \~99% |     4.4 MB |
| **A100 GPU (scaled config)**     |             96 |         256 |        128 |   100,000 |     50 | <10 h   |            \~99–99.5% |                  \~99–99.6% |      16 MB |

**Why this matters:** Data often beats parameters - simply training the small architecture on 100k sentences closed most of the gap. Doing the same 10x dataset on an M1 Pro would take more than a week, so this result is only practical because of the A100's throughput.

## Cross‑Device Plot Twist: Same Weights, Different Results

When I moved an A100‑trained model to my MacBook (MPS backend), its accuracy dropped. Same weights - different behavior. Why? Apparently,

* **Precision modes** differ (A100 often uses **TF32** by default; MPS uses **FP32**).
* **Backend kernels** differ (cuDNN vs. Metal), changing reduction order and numerical drift.
* **MPS CPU fallbacks** for unsupported ops can subtly change numerics.

So, addressing this is still on my TODO list but while before I do that, both the MPS- and CUDA-compatible models are available under [the v0.1.0 release](https://github.com/armish/nokta-ai/releases/tag/v0.1.0).

## Lessons Learned

1. **Simple problems aren’t simple.** Language has corner cases; Turkish has *delightful* ones.
2. **Masking and data balance matter more than fancy layers.** You can’t out‑architect skewed data.
3. **Constraints breed innovation.** Lowercasing + six‑character focus + explicit case restoration beat my 12‑head uppercase/lowercase attempt by a mile.
4. **Hardware matters.** GPUs don’t just speed things up; they expose bugs and numerical differences.
5. **Data is king.** Scaling examples produced bigger gains than scaling parameters.
6. **Cross‑platform reproducibility is tricky.** CUDA and MPS won’t perfectly agree.


## Final Thought: Fun Over Necessity

Rule‑based deasciifiers solved this well enough for most use cases **years** ago - fast, deterministic, CPU‑only. Neural nets can push accuracy closer to perfection, but they demand GPUs, data pipelines, and overnight runs.

Was any of this strictly necessary? **No.** Was it a blast? **Absolutely.** 🚀

The real joy wasn’t “beating” the old tools; it was the journey - discovering quirks of Turkish orthography, debugging across hardware, and watching a model learn that *"kasap"* stays as `s` while *"yaşam"* becomes `ş`.