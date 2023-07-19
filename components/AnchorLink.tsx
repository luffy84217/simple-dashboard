import React from 'react';

import NavBarItem from './NavBarItem';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
  children?: React.ReactNode;
  href?: string;
  className?: string;
  icon?: IconProp;
  tabIndex?: number;
  testId: string;
};

const AnchorLink: React.FC<Props> = ({ children, href, className, icon, tabIndex, testId }) => {
  return (
    <a href={href}>
      <NavBarItem href={href} className={className} icon={icon} tabIndex={tabIndex} testId={testId}>
        {children}
      </NavBarItem>
    </a>
  );
};

export default AnchorLink;
