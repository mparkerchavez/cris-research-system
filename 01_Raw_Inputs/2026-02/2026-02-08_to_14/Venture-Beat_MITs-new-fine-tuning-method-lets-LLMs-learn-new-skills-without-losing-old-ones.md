# MIT's new fine-tuning method lets LLMs learn new skills without losing old ones

## Metadata
* **Publisher:** Venture Beat
* **Author:** Ben Dickson
* **Published:** 2026-02-11
* **Type:** Article
* **URL:** https://venturebeat.com/orchestration/mits-new-fine-tuning-method-lets-llms-learn-new-skills-without-losing-old
* **Captured:** 2026-02-14

---

When enterprises fine-tune LLMs for new tasks, they risk breaking everything the models already know. This forces companies to maintain separate models for every skill.

Researchers at MIT, the Improbable AI Lab and ETH Zurich have developed a new technique that enables large language models to learn new skills and knowledge without forgetting their past capabilities.

Their technique, called [self-distillation fine-tuning](https://arxiv.org/abs/2601.19897) (SDFT), allows models to learn directly from demonstrations and their own experiments by leveraging the inherent in-context learning abilities of modern LLMs. Experiments show that SDFT consistently outperforms traditional supervised fine-tuning (SFT) while addressing the limitations of reinforcement learning algorithms.

For enterprise applications, the method enables a single model to accumulate multiple skills over time without suffering from performance regression on earlier tasks. This offers a potential pathway for building AI agents that can adapt to dynamic business environments, gathering new proprietary knowledge and skills as needed without requiring expensive retraining cycles or losing their general reasoning abilities.

## The challenge of continual learning

Once an LLM is trained and deployed, it remains static. It does not update its parameters to acquire new skills, internalize new knowledge, or improve from experience. To build truly adaptive AI, the industry needs to solve " [continual learning](https://venturebeat.com/technology/four-ai-research-trends-enterprise-teams-should-watch-in-2026)," allowing systems to accumulate knowledge much like humans do throughout their careers.

The most effective way for models to learn is through "on-policy learning.” In this approach, the model learns from data it generates itself allowing it to correct its own errors and reasoning processes. This stands in contrast to learning by simply mimicking static datasets. Without on-policy learning, models are prone to " [catastrophic forgetting](https://en.wikipedia.org/wiki/Catastrophic_interference)," a phenomenon where learning a new task causes the model to lose its past knowledge and ability to perform previous tasks.

However, on-policy learning typically requires [reinforcement learning](https://venturebeat.com/orchestration/why-reinforcement-learning-plateaus-without-representation-depth-and-other) (RL), which depends on an explicit reward function to score the model's outputs. This works well for problems with clear outcomes, such as math and coding. But in many real-world enterprise scenarios (e.g., writing a legal brief or summarizing a meeting), defining a mathematical reward function is difficult or impossible.

RL methods also often fail when trying to teach a model entirely new information, such as a specific company protocol or a new product line. As Idan Shenfeld, a doctorate student at MIT and co-author of the paper, told VentureBeat, "No matter how many times the base model tries, it cannot generate correct answers for a topic it has zero knowledge about," meaning it never gets a positive signal to learn from.

The standard alternative is supervised fine-tuning (SFT), where the model is trained on a fixed dataset of expert demonstrations. While SFT provides clear ground truth, it is inherently "off-policy." Because the model is just mimicking data rather than learning from its own attempts, it often fails to generalize to out-of-distribution examples and suffers heavily from catastrophic forgetting.

SDFT seeks to bridge this gap: enabling the benefits of on-policy learning using only prerecorded demonstrations, without needing a reward function.

## How SDFT works

SDFT solves this problem by using "distillation," a process where a student model learns to mimic a teacher. The researchers’ insight was to use the model's own "in-context learning" (ICL) capabilities to create a feedback loop within a single model.

In-context learning is the phenomenon where you provide the LLM with a difficult task and one or more demonstrations of how similar problems are solved. Most advanced LLMs are designed to solve new problems with ICL examples, without any parameter updates.

![Self-distillation fine-tuning](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2FckgUJB2KfI2mjeMI7dM6K%2F0d7f317a1bd79c2fc24b150cdc84879d%2FGemini_Generated_Image_mepu1jmepu1jmepu.png%3Fw%3D1000%26q%3D100&w=3840&q=75)

During the training cycle, SDFT employs the model in two roles.

**The teacher:** A frozen version of the model is fed the query along with expert demonstrations. Using ICL, the teacher deduces the correct answer and the reasoning logic required to reach it.

**The student:** This version sees only the query, simulating a real-world deployment scenario where no answer key is available.

When the student generates an answer, the teacher, which has access to the expert demonstrations, provides feedback. The student then updates its parameters to align closer to the teacher's distribution.

This process effectively creates an on-policy learning loop by combining elements of SFT and RL. The supervision comes not from a static dataset, but from the model’s own interaction and outputs. It allows the model to correct its own reasoning trajectories without requiring an external reward signal. This process works even for new knowledge that RL would miss.

## SDFT in action

To validate the approach, the researchers tested SDFT using the open-weight [Qwen 2.5 model](https://venturebeat.com/ai/qwen-swings-for-a-double-with-2-5-omni-3b-model-that-runs-on-consumer-pcs-laptops) on three complex enterprise-grade skills: science Q&A, software tool use, and medical reasoning.

The results showed that SDFT learned new tasks more effectively than standard methods. On the Science Q&A benchmark, the SDFT model achieved 70.2% accuracy, compared to 66.2% for the standard SFT approach.

![SDFT knowledge preservation](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F5IZknSM9LH9iWWywZh1Hn9%2Fa45832b28e9572453e081d15e55e29ec%2FSDFT_knowledge_preservation.png%3Fw%3D1000%26q%3D100&w=3840&q=75)

Contrary to SFT, SDFT preserves the model's original knowledge while learning new tasks and knowledge (source: arXiv)

More important for enterprise adoption is the impact on catastrophic forgetting. When the standard SFT model learned the science task, its ability to answer general questions (such as logic or humanities) collapsed. In contrast, the SDFT model improved on the science task while holding its "Previous Tasks" score steady at 64.5%. This stability suggests companies could specialize models for specific departments (e.g., HR or Legal) without degrading the model’s basic common sense or reasoning capabilities.

The team also simulated a knowledge injection scenario, creating a dataset of fictional "2025 Natural Disasters" to teach the model new facts. They tested the model on indirect reasoning questions, such as "Given the floods in 2025, which countries likely needed humanitarian aid?"

Standard SFT resulted in a model that memorized facts but struggled to use them in reasoning scenarios. The SDFT model, having internalized the logic during training, scored 98% on the same questions.

Finally, the researchers conducted a sequential learning experiment, training the model on science, tool use, and medical tasks one after another. While the standard model’s performance oscillated, losing previous skills as it learned new ones, the SDFT model successfully accumulated all three skills without regression.

![SDFT sequential learning](https://venturebeat.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fjdtwqhzvc2n1%2F25Yi9huYe4YZEdLa6N5Lkd%2Fd17fa8790cd95012f809d204925ce76d%2FSDFT_sequential_learning.png%3Fw%3D1000%26q%3D100&w=3840&q=75)

SDFT can learn different skills sequentially while preserving its previous knowledge (source: arXiv)

This capability addresses a major pain point for enterprises currently managing "model zoos" of separate adapters for different tasks.

"We offer the ability to maintain only a single model for all the company's needs," Shenfeld said. This consolidation "can lead to a substantial reduction in inference costs" because organizations don't need to host multiple models simultaneously.

## SDFT limitations and availability

The code for SDFT is available on GitHub and ready to be integrated into existing model training workflows.

"The SDFT pipeline is more similar to the RL pipeline in that it requires online response generation during training," Shenfeld said. They are working with Hugging Face to integrate SDFT into the latter’s [Transformer Reinforcement Learning](https://huggingface.co/docs/trl/en/index) (TRL) library, he added, noting that a pull request is already open for developers who want to test the integration.

For teams considering SDFT, the practical tradeoffs come down to model size and compute. The technique requires models with strong enough in-context learning to act as their own teachers — currently around 4 billion parameters with newer architectures like Qwen 3, though Shenfeld expects 1 billion-parameter models to work soon. It demands roughly 2.5 times the compute of standard fine-tuning, but is best suited for organizations that need a single model to accumulate multiple skills over time, particularly in domains where defining a reward function for reinforcement learning is difficult or impossible.

While effective, the method does come with computational tradeoffs. SDFT is approximately four times slower and requires 2.5 times more computational power (FLOPs) than standard fine-tuning because the model must actively generate its own answers ("rollouts") during training to compare against the teacher. However, the researchers note that because the model retains knowledge better, organizations may avoid the costly multi-stage retraining processes often required to repair models that suffer from catastrophic forgetting.

The technique also relies on the underlying model being large enough to benefit from in-context learning. The paper notes that smaller models (e.g., 3 billion parameters) initially struggled because they lacked the "intelligence" to act as their own teachers.

However, Shenfeld said that the rapid improvement of small models is changing this dynamic. "The Qwen 2.5 3B models were too weak, but in some experiments we currently do, we found that the Qwen 3 4B model is strong enough," he said. "I see a future where even 1B models have good enough ICL capabilities to support SDFT."

Ultimately, the goal is to move beyond static snapshots toward systems that improve through use.

"Lifelong learning, together with the ability to extract learning signal from unstructured user interactions... will bring models that just keep and keep improving with time,” Shenfeld said.

“Think about the fact that already the majority of compute around the world goes into inference instead of training. We have to find ways to harness this compute to improve our models."