import type { Locale } from './config';
import type { PageKey } from './routes';

interface UiStrings {
  skipToContent: string;
  mainNavLabel: string;
  /** Accessible name of the language switcher, written in the language it links to. */
  switchToThisLanguage: string;
  nav: Record<PageKey, string>;
  meta: Record<PageKey, { title: string; description: string }>;
  home: {
    aboutHeading: string;
    skillsHeading: string;
    highlightsHeading: string;
    ctaExperience: string;
    ctaContact: string;
    seeAllProjects: string;
  };
  experience: {
    heading: string;
    intro: string;
    present: string;
    technologies: string;
  };
  certifications: {
    heading: string;
    intro: string;
    issued: string;
    expires: string;
    credentialId: string;
    verify: string;
  };
  projects: {
    heading: string;
    intro: string;
    source: string;
    website: string;
    technologies: string;
  };
  contact: {
    heading: string;
    intro: string;
    email: string;
    elsewhere: string;
    securityHeading: string;
    securityText: string;
  };
  footer: {
    builtWith: string;
    source: string;
  };
  notFound: {
    title: string;
    text: string;
    back: string;
  };
  externalLink: string;
}

const en: UiStrings = {
  skipToContent: 'Skip to main content',
  mainNavLabel: 'Main',
  switchToThisLanguage: 'View this page in English',
  nav: {
    home: 'About',
    experience: 'Experience',
    certifications: 'Certifications',
    projects: 'Projects',
    contact: 'Contact',
  },
  meta: {
    home: {
      title: 'DevSecOps Architect',
      description:
        'CV and portfolio of Andrés Molina Bustamante, DevSecOps architect and CISSP: experience, certifications and projects.',
    },
    experience: {
      title: 'Experience',
      description:
        'Professional experience of Andrés Molina Bustamante in DevSecOps, platform engineering and cloud security.',
    },
    certifications: {
      title: 'Certifications',
      description: 'Security and cloud certifications held by Andrés Molina Bustamante, CISSP.',
    },
    projects: {
      title: 'Projects',
      description: 'Selected DevSecOps and security engineering projects by Andrés Molina Bustamante.',
    },
    contact: {
      title: 'Contact',
      description: 'How to get in touch with Andrés Molina Bustamante, DevSecOps architect.',
    },
  },
  home: {
    aboutHeading: 'About me',
    skillsHeading: 'Skills',
    highlightsHeading: 'Featured projects',
    ctaExperience: 'View experience',
    ctaContact: 'Get in touch',
    seeAllProjects: 'See all projects',
  },
  experience: {
    heading: 'Experience',
    intro: 'Roles I have held, most recent first.',
    present: 'Present',
    technologies: 'Technologies',
  },
  certifications: {
    heading: 'Certifications',
    intro: 'Professional certifications, most recent first.',
    issued: 'Issued',
    expires: 'Expires',
    credentialId: 'Credential ID',
    verify: 'Verify credential',
  },
  projects: {
    heading: 'Projects',
    intro: 'A selection of work I am proud of.',
    source: 'Source code',
    website: 'Website',
    technologies: 'Technologies',
  },
  contact: {
    heading: 'Contact',
    intro: 'The best way to reach me is by email.',
    email: 'Email',
    elsewhere: 'Elsewhere',
    securityHeading: 'Reporting a security issue',
    securityText: 'Found a vulnerability in this site? The security.txt file explains how to report it.',
  },
  footer: {
    builtWith: 'Static site built with Astro. No cookies, no trackers, no third-party resources.',
    source: 'Source code',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has moved.',
    back: 'Go to the home page',
  },
  externalLink: '(external site)',
};

const es: UiStrings = {
  skipToContent: 'Saltar al contenido principal',
  mainNavLabel: 'Principal',
  switchToThisLanguage: 'Ver esta página en español',
  nav: {
    home: 'Sobre mí',
    experience: 'Experiencia',
    certifications: 'Certificaciones',
    projects: 'Proyectos',
    contact: 'Contacto',
  },
  meta: {
    home: {
      title: 'Arquitecto DevSecOps',
      description:
        'CV y portafolio de Andrés Molina Bustamante, arquitecto DevSecOps y CISSP: experiencia, certificaciones y proyectos.',
    },
    experience: {
      title: 'Experiencia',
      description:
        'Experiencia profesional de Andrés Molina Bustamante en DevSecOps, ingeniería de plataformas y seguridad cloud.',
    },
    certifications: {
      title: 'Certificaciones',
      description: 'Certificaciones de seguridad y cloud de Andrés Molina Bustamante, CISSP.',
    },
    projects: {
      title: 'Proyectos',
      description: 'Proyectos seleccionados de DevSecOps e ingeniería de seguridad de Andrés Molina Bustamante.',
    },
    contact: {
      title: 'Contacto',
      description: 'Cómo contactar con Andrés Molina Bustamante, arquitecto DevSecOps.',
    },
  },
  home: {
    aboutHeading: 'Sobre mí',
    skillsHeading: 'Habilidades',
    highlightsHeading: 'Proyectos destacados',
    ctaExperience: 'Ver experiencia',
    ctaContact: 'Contactar',
    seeAllProjects: 'Ver todos los proyectos',
  },
  experience: {
    heading: 'Experiencia',
    intro: 'Puestos que he ocupado, del más reciente al más antiguo.',
    present: 'Actualidad',
    technologies: 'Tecnologías',
  },
  certifications: {
    heading: 'Certificaciones',
    intro: 'Certificaciones profesionales, de la más reciente a la más antigua.',
    issued: 'Emitida',
    expires: 'Vence',
    credentialId: 'ID de credencial',
    verify: 'Verificar credencial',
  },
  projects: {
    heading: 'Proyectos',
    intro: 'Una selección de trabajos de los que me siento orgulloso.',
    source: 'Código fuente',
    website: 'Sitio web',
    technologies: 'Tecnologías',
  },
  contact: {
    heading: 'Contacto',
    intro: 'La mejor forma de contactarme es por correo electrónico.',
    email: 'Correo',
    elsewhere: 'En otras plataformas',
    securityHeading: 'Reportar un problema de seguridad',
    securityText: '¿Encontraste una vulnerabilidad en este sitio? El archivo security.txt explica cómo reportarla.',
  },
  footer: {
    builtWith: 'Sitio estático hecho con Astro. Sin cookies, sin rastreadores, sin recursos de terceros.',
    source: 'Código fuente',
  },
  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o se ha movido.',
    back: 'Ir a la página de inicio',
  },
  externalLink: '(sitio externo)',
};

export const ui: Record<Locale, UiStrings> = { en, es };

export function useTranslations(locale: Locale): UiStrings {
  return ui[locale];
}
