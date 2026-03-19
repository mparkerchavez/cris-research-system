# Stanford AI Experts Predict What Will Happen in 2026 \| Stanford HAI

## Metadata

* **Publication:** Stanford HAI
* **Author:** Shana Lynch
* **Published:** 2025-12-15
* **Captured:** 2026-02-01
* **Type:** Blog Post
* **URL:** https://hai.stanford.edu/news/stanford-ai-experts-predict-what-will-happen-in-2026

---

[**Shana Lynch**](https://hai.stanford.edu/people/shana-lynch)
December 15, 2025

After years of fast expansion and billion-dollar bets, 2026 may mark the moment artificial intelligence confronts its actual utility. In their predictions for the next year, Stanford faculty across computer science, medicine, law, and economics converge on a striking theme: The era of AI evangelism is giving way to an era of AI evaluation. Whether it’s standardized benchmarks for legal reasoning, real-time dashboards tracking labor displacement, or clinical frameworks for vetting the flood of medical AI startups, the coming year demands rigor over hype. The question is no longer “Can AI do this?” but “How well, at what cost, and for whom?”

Learn more about what Stanford HAI faculty expect in the new year.

### AI Sovereignty, Global Growth

[_James Landay_](https://hai.stanford.edu/people/james-landay) _, HAI Co-Director, Professor of Computer Science, and the Anand Rajaraman and Venky Harinarayan Professor in the School of Engineering_

My biggest prediction? There will be no AGI (artificial general intelligence) this year.

But additionally, AI sovereignty will gain huge steam this year as countries try to show their independence from the AI providers and from the United States’ political system. What is AI sovereignty? In one model of sovereignty, a country might build its own large LLM. In another example, a country might run someone else’s LLM on their own GPUs so that they can make sure their data doesn’t leave their country. The term “sovereignty” isn’t well defined, and HAI is currently working on a project to help people understand these different models and provide some analysis.

We obviously have seen in 2025 a lot of investments in huge data centers around the world, whether it was UAE in May or South Korea in the fall. We probably will see organizations like Nvidia and OpenAI making tours of other countries, which is related to this AI sovereignty and how they can have an advantage. We’ll see these continued AI data center investments in 2026. But at some point, you can’t tie up all the money in the world on this one thing. It seems like a very speculative bubble.

> ![](https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2Fnews%2Fteaser-images%2FJames%20landay%20Fall%20Conference%202022.jpg&w=640&q=75)AI sovereignty will gain huge steam this year as countries show their independence from AI providers and the U.S. political system.

##### — James Landay

##### Stanford HAI Denning Co-Director

Also, in 2026 we’ll hear more companies say that AI hasn’t yet shown productivity increases, except in certain target areas like programming and call centers. We’ll hear about a lot of failed AI projects. Now, do people learn from those failures and figure out where to apply AI appropriately in ways that they’re more successful this year? Maybe.

I think we’re going to see some new custom UI AI, things beyond just the chabot or even this web browser that OpenAI released. I think this new year we’ll see previews of those things, if not real products.

Also, asymptoting. We have huge models, but we’ve seen better models that are smaller than the huge ones. It seems like we have reached some amount of peak data, both because we’re running out of data and also because the data is poor quality. I expect there will be a lot more effort on curating really good datasets that are smaller and creating models that perform better on smaller data.

Obviously, there were a lot of AI video advances that happened in 2025, but they weren’t very good. In one of my classes, though, a student team used AI to make a video that normally would have actors and special locations. It had some issues, but it was actually pretty good. I think that means the video tools have finally gotten good enough that we’ll see real uses, and we’ll see that take off in the new year. Relatedly, we’ll see a lot more copyright issues.

### Opening the Black Box Is Science’s Next Mandate

[_Russ Altman_](https://profiles.stanford.edu/russ-altman) _, the Kenneth Fong Professor in the School of Engineering and Professor of Bioengineering, of Genetics, of Medicine, and of Biomedical Data Science, and Stanford HAI Senior Fellow_

I see enormous potential in foundation models to unlock discoveries and predictions in science and medicine. Right now, there are several approaches to building these models. For example, developers can build one massive “early fusion” model incorporating all data types, or they can construct a “late fusion” model where they build separate models for each modality and integrate them afterward. I see some profound questions around this. Will separately built models work together well? What happens when some data is bad? If you have a late fusion model, where, say, you have combined several models including DNA, RNA, and proteins, you could just rebuild the DNA module without needing to rebuild the others. However, with an early fusion model, you have to rebuild everything every time there’s an update. My prediction is that in the next year, we may get clarity on whether early or late fusion is the better approach.

> I expect more focus on the archeology of the high-performing neural nets.![](https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2Fruss_altman_1.jpg&w=640&q=75)

##### — Russ Altman

##### HAI Senior Fellow

Also, people are discovering the amazing power of AI in scientific research. But in science, you need more than just an accurate prediction; you have to have insight on how the model got to that prediction. In science labs, there’s increasing focus not on the output of the model, but on the internal neural network that’s leading to the performance, the attention map of which data is paying attention to which other data.

In 2026, I expect more focus on the archeology of the high-performing neural nets. We just published a paper on this called “ [Paying attention to attention in proteins](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1013424).” I’m seeing people using things called sparse autoencoders on the deep network to try to identify the features in the data that are driving performance. In science, there’s an absolute mandate to open AI’s black box, and I’m starting to see us open that box.

Now looking at AI and the business of health, this past year we saw a ton of business investment in startups using AI for medicine. A typical hospital is inundated with interest from startups that want to sell them a solution for X. Each of those individual solutions is not unreasonable, but in aggregate, they’re like a tsunami of noise coming at an executive. This year I expect we’ll start developing ways to evaluate the impact of an AI system, its technical features, its training population, how to implement it, how efficient or disruptive it is for staff, its ROI on hospital workflow, patient happiness, quality of decisions. All of that is a process that we’re just now wrapping our arms around here at Stanford, led in part by Stanford Hospital Chief Data Scientist Nigam Shah. But then we need to make it available in less technically savvy or well-resourced markets as well.

### Legal AI Turns to ROI, Rigor, and Multi-Document Reasoning

[_Julian Nyarko_](https://law.stanford.edu/julian-nyarko/) _, Professor of Law and Stanford HAI Associate Director_

I predict that two themes could define the year in the domain of AI for the legal services sector. First, rigor and ROI. Firms and courts might stop asking “Can it write?” and instead start asking “How well, on what, and at what risk?” I expect more standardized, domain-specific evaluations to become table stakes by tying model performance to tangible legal outcomes such as accuracy, citation integrity, privilege exposure, and turnaround time. There could also be a stronger focus on efficiency gains inside real workflows (document management, billing, and knowledge systems) rather than in controlled, artificial scenarios. Second, AI will take on harder work. Beyond intake and first drafts, we already begin seeing a shift toward systems that tackle, for instance, multi-document reasoning: synthesizing facts, mapping arguments, and surfacing counter-authority with provenance. This shift demands new frameworks for measurement – such as LLM-as-judge and pairwise preference ranking – to evaluate complex legal tasks at scale. Emerging benchmarks like GDPval, built around these ideas, could steer development roadmaps toward higher-order tasks.

![](https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2Falgorithms_christin_3x2.jpg&w=3840&q=75)

We will see more realism about what we can expect from AI.

Angèle Christin

HAI Senior Fellow

### Deflating the AI Bubble

[_Angèle Christin_](https://comm.stanford.edu/people/angele-christin) _, Associate Professor of Communication and Stanford HAI Senior Fellow_

The billboards in San Francisco say it all: AI everywhere!!! For everything!!! All the time!!! The slightly manic tone of these advertisements gives a sense of the hopes – and immense investments – placed in generative AI and AI agents.

So far, financial markets and big tech companies have doubled down on AI, spending massive amounts of money and human capital, and building gargantuan computing infrastructures to sustain AI growth and development. Yet already there are signs that AI may not accomplish everything we hope it will. There are also hints that AI, in some cases, can misdirect, deskill, and harm people. And there is data showing that the current buildout of AI comes with tremendous environmental costs.

I expect that we will see more realism about what we can expect from AI. AI is a fantastic tool for some tasks and processes; it is a problematic one for others (hello, students generating final essays without doing the readings!). In many cases, the impact of AI is likely to be moderate: some efficiency and creativity gain here, some extra labor and tedium there. I am particularly excited to see more fine-grained empirical studies of what AI does and what it cannot do. This is not necessarily the bubble popping, but the bubble might not be getting much bigger.

### A “ChatGPT Moment” for AI in Medicine

[_Curtis Langlotz_](https://profiles.stanford.edu/curtis-langlotz) _, Professor of Radiology, of Medicine, and of Biomedical Data Science, Senior Associate Vice Provost for Research, and Stanford HAI Senior Fellow_

Until recently, developing medical AI models was extremely expensive, requiring training data labeled by well-paid medical experts (for example, labeling a mammogram as either benign or malignant). New self-supervised machine learning methods, now widely used by the developers of commercial chatbots, don’t require labels and have dramatically reduced the cost of medical AI model training.

Medical AI researchers have been slower to assemble the massive datasets needed to capitalize on self-supervision because of the need to preserve the privacy of patient data. But self-supervised learning from somewhat smaller datasets has shown promise in [radiology](https://www.nature.com/articles/s41586-025-09079-8), [pathology](https://www.nature.com/articles/s41586-024-07441-w), [ophthalmology](https://www.nature.com/articles/s41586-023-06555-x), [dermatology](https://www.nature.com/articles/s41591-024-02887-x), [oncology](https://www.nature.com/articles/s41586-024-08378-w), [cardiology](https://www.nature.com/articles/s41586-025-09227-0), and [many other areas of biomedicine](https://www.nature.com/articles/s41746-024-01166-w).

Many of us will remember the magic moment when we discovered the incredible capabilities of chatbots trained with self-supervision. We will soon see a similar “ChatGPT moment” for AI in medicine, when AI models are trained on massive high-quality healthcare data rivaling the scale of data used to train chatbots. These new biomedical [foundation models](https://arxiv.org/abs/2108.07258) will boost the accuracy of medical AI systems and will enable new tools that diagnose rare and uncommon diseases for which training datasets are scarce.

![](https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2Favatars%2FErik-Brynjolfsson_7.jpg&w=3840&q=75)

Arguments about AI’s economic impact will finally give way to careful measurement.

Erik Brynjolfsson

HAI Senior Fellow

### From Hype to Dashboards: Measuring AI in Real Time

[_Erik Brynjolfsson_](https://hai.stanford.edu/people/erik-brynjolfsson) _, Digital Economy Lab Director, Jerry Yang and Akiko Yamazaki Professor, and Stanford HAI and SIEPR Senior Fellow_

In 2026, arguments about AI’s economic impact will finally give way to careful measurement. We’ll see the emergence of high-frequency “AI economic dashboards” that track, at the task and occupation level, where AI is boosting productivity, displacing workers, or creating new roles. Using payroll, platform, and usage data, these tools will function like real-time national accounts. In our “ [Canaries in the Coal Mine](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/)” work with ADP, we already see early-career workers in AI-exposed occupations experiencing weaker employment and earnings outcomes; in 2026, similar indicators will be updated monthly, not years later. Executives will check AI exposure metrics daily alongside revenue dashboards, and policymakers will use them to target training, safety nets, and innovation policy. The debate will shift from whether AI matters to how quickly its effects are diffusing, who is being left behind, and which complementary investments best turn AI capability into broad-based prosperity.

### GenAI Attempts to Bypass the Enterprise

[_Nigam Shah_](https://profiles.stanford.edu/nigam-shah) _, Professor of Medicine and of Biomedical Data Science, and Chief Data Scientist for Stanford Health Care_

As the buzz around the use of GenAI builds, the creators of the technologies will get frustrated with the long decision cycles at health systems and begin going directly to the user in the form of applications that are made available for “free” to end users. Consider, for example, efforts such as literature summaries by [OpenEvidence](https://www.openevidence.com/) and on-demand answers to clinical questions by [AtroposHealth](https://home.atroposhealth.com/experience-the-difference-of-atropos-health-evidence).

On the technology side, we will see a rise in generative transformers that have the potential to forecast diagnoses, treatment response, or disease progression without needing any task-specific labels.

Given this rise in available solutions, the need for patients to know the basis on which AI “help” is being provided will become crucial (see [my prior commentary](https://hai.stanford.edu/news/how-is-ai-changing-your-doctor-visit) on this). The ability for researchers to keep up with technology developments via good benchmarking will be stretched thin, even if it is widely recognized to be important. And we will see a rise in solutions that empower patients to have agency in their own care (e.g., [this example](https://www.statnews.com/2025/09/10/ai-cancer-treatment-custom-doctors-response/) involving cancer treatment).

> We’re at an important point of reflection to think about what we really want from AI.![](https://hai.stanford.edu/_next/image?url=https%3A%2F%2Fhai.stanford.edu%2Fassets%2Fimages%2F2023-05%2FDiyi%20Yang%202.png&w=640&q=75)

##### — Diyi Yang

##### Assistant Professor of Computer Science

### Advancing Human-AI Interaction for Long-Term Benefits

[_Diyi Yang_](https://cs.stanford.edu/~diyiy/group.html) _, Assistant Professor of Computer Science_

More development is needed around building AI systems that can lead to long-term benefits. With the increasing sycophancy exhibited in LLMs, the growing use of LLMs for mental health and companionship, and AI’s influence on critical thinking and essential skills, we’re at an important point of reflection to think about what we really want from AI and how to make it happen.

Personally, I would like to see more work around designing human-centered AI systems that are not only technically capable, but also meaningfully connected to how people think, interact, and collaborate. This requires going beyond optimizing AI systems for short-term engagement or satisfaction and instead prioritizing how human-AI interactions shape users’ long-term development and well-being. We need AI systems that augment human capabilities, and this needs to be built into the AI development process from the start, not treated as a post-hoc alignment problem.