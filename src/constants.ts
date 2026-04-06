import { CaseStudy } from './types';

export const DOMAINS = [
  'Business Strategy',
  'Economics',
  'Branding',
  'Marketing',
  'Sales',
  'History',
  'Human Behavior'
];

export const FRAMEWORKS = [
  "Porter's Five Forces",
  "SWOT Analysis",
  "Value Chain Analysis",
  "BCG Matrix",
  "4Ps of Marketing",
  "Blue Ocean Strategy",
  "First Principles Thinking",
  "Game Theory",
  "Network Effects",
  "Unit Economics",
  "Jobs to be Done",
  "Pyramid Principle",
  "MECE Framework",
  "SCQA Framework",
  "Pareto Principle",
  "Occam's Razor"
];

export const MOCK_CASES: CaseStudy[] = [
  {
    id: '1',
    title: 'The Streaming Pivot',
    company: 'GlobalMedia Corp',
    domain: 'Business Strategy',
    frameworks: ["Porter's Five Forces", "Blue Ocean Strategy"],
    situation: 'A traditional cable giant is seeing a 15% YoY decline in subscribers due to cord-cutting. Competitors are launching direct-to-consumer apps.',
    problem: 'How should GlobalMedia transition to streaming without cannibalizing its existing $2B cable revenue?',
    partialData: 'Cable ARPU: $85. Streaming ARPU: $12. Content spend: $5B annually.',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'The Luxury Rebrand',
    company: 'Aura Watches',
    domain: 'Branding',
    frameworks: ["4Ps of Marketing", "Jobs to be Done"],
    situation: 'Aura, a 100-year-old watchmaker, is seen as "grandpa\'s brand" by Gen Z. Sales in the 18-35 demographic are flat.',
    problem: 'Reposition the brand to appeal to younger luxury buyers while maintaining heritage status.',
    partialData: 'Brand awareness: 90% (50+), 15% (under 30). Average price: $4,500.',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Hyper-Growth Logistics',
    company: 'SwiftDeliver',
    domain: 'Economics',
    frameworks: ["Unit Economics", "Network Effects"],
    situation: 'SwiftDeliver is losing $2 per delivery but growing at 30% monthly. Investors are demanding a path to profitability.',
    problem: 'Identify the levers to achieve positive unit economics without stalling growth.',
    partialData: 'Delivery fee: $3.99. Driver pay: $4.50. Marketing cost per acquisition: $45.',
    difficulty: 'Advanced'
  }
];
