---
layout: post
title:  "bioRxiv - The Case of Removed Papers"
date:   2014-07-07 15:40:01
categories: biorxiv preprint paper
---

I love preprint services. 
I love the idea of archiving preprints, short-cutting the painful peer-review process and sharing the results in an easy and quick manner.
This is why for [our latest paper](http://www.biorxiv.org/content/early/2014/05/29/005686), 
I insisted on experimenting with the idea and actually ended up posting the paper on [bioRxiv](http://www.biorxiv.org/content/early/2014/05/29/005686).

There are various preprint servers available out there (nicely listed [here](http://jabberwocky.weecology.org/2014/07/07/which-preprint-server-should-i-use/))
and although the concept is the same for all,
the audience to which you want to reach out differs a lot.

[As you know](http://ergoso.me/general/2014/01/06/about.html), I am studying Computational Biology, hence I am a fan of the new [bioRxiv](http://www.biorxiv.org/) service.
I have been subscribed to e-mail alerts for the subject areas that I am interested in since the service started.
I usually use my e-mail box as a task manager and label e-mails for adding them to my *have-a-look-at* list.
This is especially useful for queuing papers of interest to me for reading them later.
And once I have the time, I go back to these marked e-mails, check these papers out by reading their abstracts and downloading the full article when necessary.

I have also been doing the same thing for [bioRxiv](http://www.biorxiv.org/) e-alerts
and lately noticed something weird: **some of my saved papers were not accessible on the site any more**.
The first time it happened to me, I thought this was a bug on the site and did not worry much about it.
The second time, however, was enough to get me suspicious.
So I went back to these missing papers and double checked the links on the [bioRxiv](http://www.biorxiv.org/),
but all I was getting was an error on the site saying:

<div class="quote">
<b>Access Denied</b><br/>
You are not authorized to access this page.
</div>

Interesting enough, I found that these papers were not even being listed on the site!
Maybe, I thought, these papers were removed from the site on purpose, but is this even possible?
According to the documentation on the site, it is not supposed to happen:

<div class="quote">
... Authors may submit a revised version of an article to bioRxiv at any time and can update the bioRxiv record with a link to a version of an article that has been published in a journal. <b>Once posted on bioRxiv, articles are citable and therefore cannot be removed</b>...
</div>

So I tweeted about it:

<blockquote class="twitter-tweet" lang="en"><p>and when you go to the website for one of these, it says &quot;access denied&quot; -- a bug or a feature? More transparency on this would be great.</p>&mdash; B. Arman Aksoy (@armish) <a href="https://twitter.com/armish/statuses/484495976494030848">July 3, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

but got no response back.
Then I decided to see if I can scrape all such removed papers from the site to see if there are too may of these removed papers
and came up with [a really small script](https://gist.github.com/armish/8693f1afbc80a7e6d503) that records the HTTP response for successive biorXiv DOI numbers up to a point.
Based on this HTTP response, you can categorize the papers as follows:

* **404**: the DOI has not been registered yet.
* **200**: the DOI has been registered and the paper is available.
* **403**: the DOI has been registered but access to the paper is restricted -- *i.e.* the paper has been removed.

Running the script and collecting this information for all DOIs from `10.1101/000001` up to `10.1101/007000`,
I found 498 published and 5 removed [bioRxiv](http://www.biorxiv.org/) papers.
**This means that almost 1% of the [bioRxiv](http://www.biorxiv.org/) papers has been removed from the *archive* with no explanation at all.**

It also turns out that although [bioRxiv](http://www.biorxiv.org/) has removed these articles, 
Google has not forgotten about them yet.
So for those that are curious, here is the list of removed papers and their titles:

1. [10.1101/002055](http://dx.doi.org/10.1101/002055): *Somatic mitochondrial DNA mutations are associated with progression, metastasis and death in oral squamous cell carcinoma*
2. [10.1101/002089](http://dx.doi.org/10.1101/002089): *Protectome analysis: a new selective bioinformatics tool for bacterial vaccine candidate discovery*
3. [10.1101/002451](http://dx.doi.org/10.1101/002451): *Genome-Wide Introgression Revealed Pervasive Hybrid Incompatibilities (HI) between Caenorhabditis species*
4. [10.1101/003251](http://dx.doi.org/10.1101/003251): *SeqGL identifies context-dependent binding signals in genome-wide regulatory element maps*
5. [10.1101/005421](http://dx.doi.org/10.1101/005421): *CRISPR/Cas9 nuclease-mediated gene knock-in in bovine pluripotent stem cells and embryos*

The number of removed papers might not be that big, but I think the situation is worrisome.
I am pretty sure there are valid reasons to why these papers were removed after they got posted on the site,
but I think if [bioRxiv](http://www.biorxiv.org/) is planning to be the *de facto* preprint server for Biological Sciences,
then it should be either more strict about its terms of distribution or be more transparent about its decisions.

What do you think?

