export interface ServiceItem {
  label: string;
  icon: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: boolean;
  cta?: boolean;
  children?: ServiceItem[];
}

export function getNavItems(BASE: string): NavItem[] {
  return [
    { label: "Inicio", href: BASE },
    {
      label: "Servicios",
      dropdown: true,
      children: [
        {
          label: "Diseño Web",
          icon: "material-symbols:palette",
          href: `${BASE}servicios/diseno`,
        },
        {
          label: "Desarrollo",
          icon: "material-symbols:code",
          href: `${BASE}servicios/desarrollo`,
        },
      ],
    },
    { label: "Nosotros", href: `${BASE}nosotros` },
    { label: "Blog", href: `${BASE}blog` },
    { label: "Contacto", href: `${BASE}contacto`, cta: true },
  ];
}
