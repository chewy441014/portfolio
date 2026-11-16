export const services = [
  {
    id: 'tutoring',
    number: '01',
    title: 'Tutoring',
    subtitle: 'Find your next aha moment.',
    description: 'Make sense of math and science, one question and one concept at a time.',
    href: '/tutoring/',
    color: 'pink',
    action: 'Explore tutoring',
  },
  {
    id: 'web-development',
    number: '02',
    title: 'Web development',
    subtitle: 'Give your idea a home online.',
    description: 'Thoughtful websites that help people understand what you do and take the next step.',
    href: '/web-development/',
    color: 'green',
    action: 'Explore web development',
  },
  {
    id: 'private-chef',
    number: '03',
    title: 'Private chef',
    subtitle: 'Make a little room at the table.',
    description: 'A meal starts with the people sharing it. Let’s talk about what you have in mind.',
    href: '/private-chef/',
    color: 'orange',
    action: 'Explore private chef services',
  },
] as const;

export type ServiceId = (typeof services)[number]['id'];
