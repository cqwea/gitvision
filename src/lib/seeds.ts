export interface SeedModel {
  name: string
  provider: string
  description: string
  category: string
}

export const seedModels: SeedModel[] = [
  { name: 'GPT-4o', provider: 'OpenAI', description: 'Flagship multimodal model with vision, audio, and text capabilities.', category: 'Text' },
  { name: 'GPT-4o-mini', provider: 'OpenAI', description: 'Smaller, faster, cheaper version of GPT-4o for everyday tasks.', category: 'Text' },
  { name: 'o1', provider: 'OpenAI', description: 'Reasoning model with chain-of-thought for complex problem-solving.', category: 'Text' },
  { name: 'o1-mini', provider: 'OpenAI', description: 'Smaller reasoning model optimized for coding and STEM.', category: 'Text' },
  { name: 'DALL-E 3', provider: 'OpenAI', description: 'Text-to-image generation with high quality and prompt adherence.', category: 'Image' },
  { name: 'Sora', provider: 'OpenAI', description: 'Text-to-video generation with realistic physics and scenes.', category: 'Video' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Best-in-class coding and nuanced reasoning.', category: 'Text' },
  { name: 'Claude 3.5 Haiku', provider: 'Anthropic', description: 'Fast, affordable model for quick tasks.', category: 'Text' },
  { name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most powerful model for complex analysis.', category: 'Text' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', description: 'Long-context multimodal model with 1M+ token window.', category: 'Text' },
  { name: 'Gemini 1.5 Flash', provider: 'Google', description: 'Fast, efficient multimodal model optimized for scale.', category: 'Text' },
  { name: 'Gemini 2.0 Flash', provider: 'Google', description: 'Next-gen fast model with native tool use and multimodal capabilities.', category: 'Text' },
  { name: 'Llama 3.1 405B', provider: 'Meta', description: 'Open-weight frontier model rivaling proprietary models.', category: 'Text' },
  { name: 'Llama 3.1 70B', provider: 'Meta', description: 'Efficient open-source model for a wide range of tasks.', category: 'Text' },
  { name: 'Mistral Large', provider: 'Mistral', description: 'Top-tier model with multilingual excellence.', category: 'Text' },
  { name: 'Mistral Small', provider: 'Mistral', description: 'Lightweight model for cost-effective deployments.', category: 'Text' },
  { name: 'Midjourney V6', provider: 'Midjourney', description: 'Leading AI image generation with stunning artistic quality.', category: 'Image' },
  { name: 'Stable Diffusion 3.5', provider: 'Stability AI', description: 'Open-source text-to-image with impressive quality and control.', category: 'Image' },
  { name: 'Perplexity Pro', provider: 'Perplexity', description: 'AI-powered search engine with real-time web answers.', category: 'Text' },
  { name: 'Grok-2', provider: 'xAI', description: 'Real-time knowledge with witty, unfiltered responses.', category: 'Text' },
]
