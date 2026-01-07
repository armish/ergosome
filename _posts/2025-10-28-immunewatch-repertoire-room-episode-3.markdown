---
layout: post
title: "Transcript: The Repertoire Room Episode 3 - TCR-sequencing"
description: "An in-depth conversation on T cell receptor sequencing, hybrid science, and translational immuno-oncology."
date:   2025-10-28 00:00:01
categories: immunewatch detect tcr translational computational bioinformatics sequencing
---

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe
    src="https://www.youtube.com/embed/J41q0fUqeVo"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>

---

## Interview Transcript  
*Edited for clarity and readability*

**Sander Wuyts:**  
Hi everyone. A couple of years ago, I became completely obsessed with T cell repertoires—and I know I’m not the only one. That’s why I started this podcast. Welcome to **The Repertoire Room**.

My name is Sander, and I’m the co-founder and CEO of ImmuneWatch, an immunoinformatics company specializing in T cell receptor sequencing analysis. In this show, I aim to have insightful conversations with people who share this passion and go deep into T cell sequencing technologies and analysis.

Today, I’m very excited to welcome **Arman Aksoy**, Director of Computational Biology at Obsidian Therapeutics. Welcome, Arman.

**Arman Aksoy:**  
Thank you so much for having me, Sander.

---

**Sander Wuyts:**  
I’m excited to have you here. Let’s start by introducing you to everyone. What is your current role?

**Arman Aksoy:**  
I’m the Director of Computational Biology at Obsidian Therapeutics. My role involves coordinating data generation and analysis efforts across early discovery, preclinical, translational, and clinical functions.

As a startup, we’re a very lean team. My department officially consists of one person—myself—but I work very closely with at least ten others at the company who contribute computationally to the biology work.

---

**Sander Wuyts:**  
I love the “one-person department” description. That feels very fitting for a startup.

**Arman Aksoy:**  
Absolutely. Times are changing. There’s a new wave of scientists entering both academia and industry with strong computational backgrounds, and I think the computational biology landscape is constantly evolving.

---

**Sander Wuyts:**  
Many people enter computational biology through different paths. What’s your origin story?

**Arman Aksoy:**  
It definitely wasn’t a straight path. I’m originally from Turkey, where I lived and studied until the end of college. At the time, there were no formal bioinformatics or computational biology programs. I double-majored in cell biology and mathematics, which helped shape me into a hybrid scientist.

I worked in a veterinary lab focused on neurodegenerative diseases, then joined Memorial Sloan Kettering Cancer Center for graduate school. My training coincided with the rise of The Cancer Genome Atlas, and I became deeply immersed in genomics and translational medicine.

Immunology initially intimidated me, but during my postdoctoral work at the Icahn School of Medicine—at the height of checkpoint blockade therapies—I found myself drawn into immuno-oncology. Our lab evolved from purely computational into a hybrid lab, and I returned to wet-lab work focusing on T cell biology and adaptive cell therapies.

From there, I joined Agenus, then MOMA Therapeutics as the founding computational biologist, and eventually Obsidian Therapeutics, where I work today.

---

**Sander Wuyts:**  
Do you think being a hybrid scientist helped you in data analysis?

**Arman Aksoy:**  
Absolutely. Understanding how data is generated—protocols, sample preparation, and failure points—makes analysis far more effective. Wet-lab experience helps you recognize sources of error and design better experiments.

---

**Sander Wuyts:**  
What does Obsidian Therapeutics do today?

**Arman Aksoy:**  
We’re a cell and gene therapy company. Our lead program, **OBX-115**, is an investigational tumor-infiltrating lymphocyte (TIL) therapy.

What makes it unique is that the TILs are engineered to express membrane-bound IL-15, removing the need for IL-2 support and reducing toxicity. We can also regulate IL-15 expression using a small molecule. OVX115 is currently in Phase II clinical trials.

---

**Sander Wuyts:**  
How do T cell repertoires factor into your work?

**Arman Aksoy:**  
TIL therapy gives us an incredible opportunity to deeply profile polyclonal T cell repertoires. We perform routine TCR sequencing on infusion products and track clonotypes over time in blood and tissue samples.

This allows us to study persistence, expansion, depletion, and potential biomarkers of response. These data are central to our translational efforts.

---

**Sander Wuyts:**  
What were the biggest challenges in implementing TCR sequencing?

**Arman Aksoy:**  
Feasibility studies are critical—you can’t treat TCR sequencing as an afterthought. You need to test platforms, sequencing depth, vendors, and computational tools upfront.

Building a large internal dataset is essential for interpretation. TCR data are complex, and summary metrics like diversity and clonality can be misleading without proper context.

Annotation remains one of the hardest challenges. Mapping TCRs to antigens is still evolving, so we rely on validated external tools rather than constantly rebuilding internal solutions.

---

**Sander Wuyts:**  
Did all this effort make a difference?

**Arman Aksoy:**  
Absolutely. It allowed us to deeply understand our lead product across preclinical and clinical settings. TCR sequencing helps us troubleshoot, optimize, and interpret product behavior in ways that wouldn’t otherwise be possible.

---

**Sander Wuyts:**  
How do you see the field evolving?

**Arman Aksoy:**  
TCR-to-epitope datasets are still sparse, but even a single confident annotation can anchor interpretation. I expect improved experimental platforms and integration with single-cell transcriptomics to significantly advance the field.

Ultimately, I see a future where we can sequence TCRs and meaningfully understand their targets and therapeutic relevance.

---

**Sander Wuyts:**  
Final question: if you weren’t a computational biologist, what would you be doing?

**Arman Aksoy:**  
I’d be in the lab. I miss experimental work and being a true hybrid scientist.

---

**Sander Wuyts:**  
Where can people learn more about you and Obsidian?

**Arman Aksoy:**  
Our website, **https://obsidiantx.com**, is the best place to learn about Obsidian. I’m also active on LinkedIn, BlueSky, GitHub, X, and Hugging Face—just search my name.
