# Beyond the lakehouse: Fundamental's NEXUS bypasses manual ETL with a native foundation model for tabular data

## Metadata

* **Publication:** VentureBeat
* **Author:** Carl Franzen
* **Published:** 2026-02-05
* **Type:** Article
* **Captured:** 2026-02-05
* **URL:** https://venturebeat.com/data/fundamental-emerges-from-stealth-with-first-major-foundation-model-trained

---

[Carl Franzen](https://venturebeat.com/author/carlfranzen)
February 5, 2026

The deep learning revolution has a curious blind spot: the spreadsheet. While Large Language Models (LLMs) have mastered the nuances of human prose and image generators have conquered the digital canvas, the structured, relational data that underpins the global economy — the rows and columns of ERP systems, CRMs, and financial ledgers — has so far been treated as just another file format similar to text or PDFs.

That's left enterprises to forecast business outcomes using the typical bespoke, labor-intensive data science process of manual feature engineering and classic machine learning algorithms that predate modern deep learning.

But now [Fundamental](https://fundamental.tech/), a San Francisco-based AI firm co-founded by DeepMind alumni, is [launching today with $255 million in total funding to bridge this gap](https://fundamental.tech/news/launch).

Emerging from stealth, the company is debuting NEXUS, a Large Tabular Model (LTM) designed to treat business data not as a simple sequence of words, but as a complex web of non-linear relationships.

![Fundamental founders](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F2u4mChxeyloBDFKMQkeWkY%2F7beb2b8669e9c1a248ad62353d29d85a%2FFounders__1_.jpg%3Fw%3D1000%26q%3D100&w=3840&q=75)

Fundamental co-founders Jeremy Fraenkel, Annie Lamont, and Gabriel Suissa. Credit: Fundamental

## The tech: moving beyond sequential logic

Most current AI models are built on sequential logic — predicting the next word in a sentence or the next pixel in a frame.

However, enterprise data is inherently non-sequential. A customer’s churn risk isn't just a timeline; it's a multi-dimensional intersection of transaction frequency, support ticket sentiment, and regional economic shifts. Existing LLMs struggle with this because they are poorly suited to the size and dimensionality constraints of enterprise-scale tables.

"The most valuable data in the world lives in tables and until now there has been no good foundation model built specifically to understand it," said Jeremy Fraenkel, CEO and Co-founder of Fundamental.

In a recent interview with VentureBeat, Fraenkel emphasized that while the AI world is obsessed with text, audio, and video, tables remain the largest modality for enterprises. "LLMs really cannot handle this type of data very well," he explained, "and enterprises currently rely on very old-school machine learning algorithms in order to make predictions."

NEXUS was trained on billions of real-world tabular datasets using Amazon SageMaker HyperPod. Unlike traditional XGBoost or Random Forest models, which require data scientists to manually define features — the specific variables the model should look at — NEXUS is designed to ingest raw tables directly.

It identifies latent patterns across columns and rows that human analysts might miss, effectively reading the hidden language of the grid to understand non-linear interactions.

## The tokenization trap

A primary reason traditional LLMs fail at tabular data is how they process numbers. Fraenkel explains that LLMs tokenize numbers the same way they tokenize words, breaking them into smaller chunks. "The problem is they apply the same thing to numbers. Tables are, by and large, all numerical," Fraenkel noted. "If you have a number like 2.3, the '2', the '.', and the '3' are seen as three different tokens. That essentially means you lose the understanding of the distribution of numbers. It's not like a calculator; you don't always get the right answer because the model doesn't understand the concept of numbers natively."

Furthermore, tabular data is order-invariant in a way that language is not. Fraenkel uses a healthcare example to illustrate: "If I give you a table with hundreds of thousands of patients and ask you to predict which of them has diabetes, it shouldn't matter if the first column is height and the second is weight, or vice versa."

While LLMs are highly sensitive to the order of words in a prompt, NEXUS is architected to understand that shifting column positions should not impact the underlying prediction.

## Operating at the predictive layer

Recent high-profile integrations, such as [Anthropic’s Claude appearing directly within Microsoft Excel](https://venturebeat.com/technology/anthropic-rolls-out-claude-ai-for-finance-integrates-with-excel-to-rival), have suggested that LLMs are already solving tables.

However, Fraenkel distinguishes Fundamental’s work as operating at a fundamentally different layer: the predictive layer. "What they are doing is essentially at the formula layer—formulas are text, they are like code," he said. "We aren't trying to allow you to build a financial model in Excel. We are helping you make a forecast."

NEXUS is designed for split-second decisions where a human isn't in the loop, such as a credit card provider determining if a transaction is fraudulent the moment you swipe.

While tools like Claude can summarize a spreadsheet, NEXUS is built to predict the next row—whether that is an equipment failure in a factory or the probability of a patient being readmitted to a hospital.

## Architecture and availability

The core value proposition of Fundamental is the radical reduction of time-to-insight. Traditionally, building a predictive model could take months of manual labor.

"You have to hire an army of data scientists to build all of those data pipelines to process and clean the data," Fraenkel explained. "If there are missing values or inconsistent data, your model won't work. You have to build those pipelines for every single use case."

Fundamental claims NEXUS replaces this entire manual process with just one line of code. Because the model has been pre-trained on a billion tables, it doesn't require the same level of task-specific training or feature engineering that traditional algorithms do.

As Fundamental moves from its stealth phase into the broader market, it does so with a commercial structure designed to bypass the traditional friction of enterprise software adoption.

The company has already secured several seven-figure contracts with Fortune 100 organizations, a feat facilitated by a strategic go-to-market architecture where Amazon Web Services (AWS) serves as the seller of record on the AWS Marketplace.

This allows enterprise leaders to procure and deploy NEXUS using existing AWS credits, effectively treating predictive intelligence as a standard utility alongside compute and storage. For the engineers tasked with implementation, the experience is high-impact but low-friction; NEXUS operates via a Python-based interface at a purely predictive layer rather than a conversational one.

Developers connect raw tables directly to the model and label specific target columns—such as a credit default probability or a maintenance risk score—to trigger the forecast. The model then returns regressions or classifications directly into the enterprise data stack, functioning as a silent, high-speed engine for automated decision-making rather than a chat-based assistant.

## The societal stakes: beyond the bottom line

While the commercial implications of demand forecasting and price prediction are clear, Fundamental is emphasizing the societal benefit of predictive intelligence.

The company highlights key areas where NEXUS can prevent catastrophic outcomes by identifying signals hidden in structured data.

By analyzing sensor data and maintenance records, NEXUS can predict failures like pipe corrosion. The company points to the Flint water crisis — which cost over $1 billion in repairs — as an example where predictive monitoring could have prevented life-threatening contamination.

Similarly, during the COVID-19 crisis, PPE shortages cost hospitals $323 billion in a single year. Fundamental argues that by using manufacturing and epidemiological data, NEXUS can predict shortages 4-6 weeks before peak demand, triggering emergency manufacturing in time to save lives.

On the climate front, NEXUS aims to provide 30-60 day flood and drought predictions, such as for the 2022 Pakistan floods which caused $30 billion in damages.

Finally, the model is being used to predict hospital readmission risks by analyzing patient demographics and social determinants. As the company puts it: "A single mother working two jobs shouldn't end up back in the ER because we failed to predict she'd need follow-up care."

## Performance vs. latency

In the enterprise world, the definition of better varies by industry. For some, it is speed; for others, it is raw accuracy.

"In terms of latency, it depends on the use case," Fraenkel explains. "If you are a researcher trying to understand what drugs to administer to a patient in Africa, latency doesn't matter as much. You are trying to make a more accurate decision that can end up saving the most lives possible."

In contrast, for a bank or hedge fund, even a marginal increase in accuracy translates to massive value.

"Increasing the prediction accuracy by half a percent is worth billions of dollars for a bank," Fraenkel says. "For different use cases, the magnitude of the percentage increase changes, but we can get you to a better performance than what you have currently."

## Ambitious vision receives big backing

The $225 million Series A, led by Oak HC/FT with participation from Salesforce Ventures, Valor Equity Partners, and Battery Ventures, signals high-conviction belief that tabular data is the next great frontier.

Notable angel investors including leaders from Perplexity, Wiz, Brex, and Datadog further validate the company's pedigree.

Annie Lamont, Co-Founder and Managing Partner at Oak HC/FT, articulated the sentiment: "The significance of Fundamental's model is hard to overstate—structured, relational data has yet to see the benefits of the deep learning revolution."

Fundamental is positioning itself not just as another AI tool, but as a new category of enterprise AI. With a team of approximately 35 based in San Francisco, the company is moving away from the bespoke model era and toward a foundation model era for tables.

"Those traditional algorithms have been the same for the last 10 years; they are not improving," Fraenkel said. "Our models keep improving. We are doing the same thing for tables that ChatGPT did for text."

## Partnering with AWS

Through a strategic partnership with Amazon Web Services (AWS), NEXUS is integrated directly into the AWS dashboard. AWS customers can deploy the model using their existing credits and infrastructure. Fraenkel describes this as a "very unique agreement," noting Fundamental is one of only two AI companies to have established such a deep, multi-layered partnership with Amazon.

One of the most significant hurdles for enterprise AI is data privacy. Companies are often unwilling to move sensitive data to a third-party infrastructure.

To solve this, Fundamental and Amazon achieved a massive engineering feat: the ability to deploy fully encrypted models—both the architecture and the weights—directly within the customer's own environment. "Customers can be confident the data sits with them," Fraenkel said. "We are the first, and currently only, company to have built such a solution."

Fundamental’s emergence is an attempt to redefine the OS for business decisions. If NEXUS performs as advertised—handling financial fraud, energy prices, and supply chain disruptions with a single, generalized model—it will mark the moment where AI finally learned to read the spreadsheets that actually run the world. The Power to Predict is no longer about looking at what happened yesterday; it is about uncovering the hidden language of tables to determine what happens tomorrow.