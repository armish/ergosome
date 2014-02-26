---
layout: post
title:  "TCGA Methylation Data - Part I: Motivation"
date:   2014-02-26 00:00:01
categories: cancer tcga methylation
---

As I [mentioned earlier](http://ergoso.me/metabolism/cancer/tcga/mutations/2014/01/08/muwheel.html), the data available as part of the Cancer Genome Atlas (TCGA) project is incredibly useful for many types of analysis.
From a computational biologist point of view, a systematic analysis of all these data sets becomes interesting only when the analysis glues two or more different data types together (remember [this post](http://ergoso.me/cancer/tcga/mutations/mgam/2014/01/28/mgam.html)?).
People usually try to show that their analysis is strongly coupled to the survival data, 
meaning that their results might help explain how likely a patient is expected to survive in a given time frame, let's say five years.
The survival data set is quite important for many reasons;
but people use it, mainly because it is often the only quantifiable phenotype that you can easily get out from the TCGA project.
This is also why you almost always see some sort of Kaplan-Meier plot as the last figure of computational biology papers that have something to do with cancer genomics.

I am, of course, not critizing this approach -- not at all.
I am simply saying this, because I've come to learn (quite late) that for such a computational approach to succeed, you need the following:

1. Input data, *e.g.* mutations or copy-number alterations
2. Quantifiable or categorical phenotype, *e.g.* survival or subtype  
3. A method that can use your input data to predict a phenotype with some success rate and also can tell you how it does it, *e.g.* important features.

I am sure, by now, you realized that this is a typical machine learning problem and that is why using these algorithms are so important in this field.
As you can expect, there are many algorithms out there that can efficiently attack this problem;
but the actual problem is the availibility of the phenotype data.

So the problem, actually, is that we don't have much information about patients that can be used a direct phenotypic measure.
People have already realized that for different types of data,
there are ways of summarizing the multi-dimensional data in such a way that it can be used as a phenotype in an analysis like I mentioned above.
Not surprisingly, these efforts lead to many interesting biological associations, such as:

1. Epigenetic *MLH1* silencing and microsatellite instability ([Simpkins et al., 1999](http://hmg.oxfordjournals.org/content/8/4/661.short))
2. *POLE* mutations and extremely high mutation rates ([Palles et al., 2013](http://www.nature.com/ng/journal/v45/n2/abs/ng.2503.html))
3. *IDH1/2* mutations and hyper-methylation ([Turcan et al., 2012](http://www.nature.com/nature/journal/v483/n7390/abs/nature10866.html))

As you know, I am really interested in characterizing possible outcomes of alterations in metabolic genes;
so after reading a bunch of papers about the *IDH*-case and having lots and lots of discussions with [Ed](http://pseudon-ome.blogspot.com/),
we decided to analyze the TCGA data to answer the following question:

<div class="quote">
	Do somatic alterations in any of the metabolic genes lead to an abbarent methylation profile in tumors, such as hypo- and hyper-methylation? 
</div>

At first, the question seemed to be easily approachable;
but to my surprise, it took us quite a lot of time to actually understand the nature of the data 
and devise ways to ask this question in a proper way.

This was yet another pet project of ours and although it did not lead us to any interesting results, that is, results interesting enough to get published, 
I learned a lot from it and wanted to share all these things I get to learn in the process.
I will split everything into five different blog posts, each of them covering different aspects of the analysis, with first one being this very post as an introduction:

1. Motivation 
2. Hyper- and hypo-methylation as a phenotype
3. Learning with random forests and extracting important features
4. Genomic alterations that correlate with different methylation profiles 
5. Wrap-up and more about methylation profiles

So stay tuned for new posts with some nice heatmaps, R scripts and interesting gene lists!
