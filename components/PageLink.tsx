import React from 'react';
import Link from 'next/link';

import NavBarItem from './NavBarItem';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
  children?: React.ReactNode;
  href: string;
  className?: string;
  icon?: IconProp;
  tabIndex?: number;
  testId: string;
};

const PageLink: React.FC<Props> = ({ children, href, className, icon, tabIndex, testId }) => {
  return (
    <Link legacyBehavior href={href}>
      <a>
        <NavBarItem href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId}>
          {children}
        </NavBarItem>
      </a>
    </Link>
  );
};

export default PageLink;
