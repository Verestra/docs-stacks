import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar untuk Stacks Workshop - disusun sesuai alur pembelajaran
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🎯 Pengenalan Workshop',
      collapsed: false,
      items: [
        'workshop-intro/introduction',
        'workshop-intro/intro',
      ],
    },
    {
      type: 'category', 
      label: '🚀 Memulai',
      collapsed: false,
      items: [
        'getting-started/introduction',
        {
          type: 'category',
          label: '📚 Teori dan Konsep Dasar',
          collapsed: false,
          items: [
            'getting-started/intro-blockchain',
            'getting-started/intro-bitcoin',
            'getting-started/proof-of-work',
            'getting-started/layer2-solutions',
            'getting-started/what-is-stacks',
          ],
        },
        {
          type: 'category',
          label: '🛠️ Setup Development',
          collapsed: false,
          items: [
            'getting-started/wallet-setup',
            'getting-started/clarinet-setup',
            'getting-started/clarity-basics',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🎮 Hari 1: Project Tic Tac Toe',
      collapsed: false,
      items: [
        'day1-tic-tac-toe/introduction',
        'day1-tic-tac-toe/tic-tac-toe-project',
      ],
    },
    {
      type: 'category',
      label: '💼 Hari 2: Project Solo', 
      collapsed: false,
      items: [
        'day2-solo-projects/introduction',
        'day2-solo-projects/solo-project-guide',
        'day2-solo-projects/fungible-tokens',
      ],
    },
    {
      type: 'category',
      label: '🔧 Topik Lanjutan',
      collapsed: true,
      items: [
        'advanced-topics/introduction',
        'advanced-topics/deployment-guide',
      ],
    },
    {
      type: 'category',
      label: '📚 Referensi',
      collapsed: true,
      items: [
        'reference/introduction',
        'reference/clarinet-commands',
        'reference/version-compatibility',
      ],
    },
  ],
};

export default sidebars;