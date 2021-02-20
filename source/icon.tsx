import React from 'react';

type IconProps = {
  size?: string | number;
  stroke?: string;
};

const ChevronDown: React.FC<IconProps> = ({
  size = 20,
  stroke = 'currentColor',
  ...rest
}) => {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="side-navigation-panel-select-option-icon side-navigation-panel-select-option-icon-chevron-down"
        {...rest}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </>
  );
};

export const ChevronDownIcon = React.memo(ChevronDown);

const ChevronUp: React.FC<IconProps> = ({
  size = 20,
  stroke = 'currentColor',
  ...rest
}) => {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="side-navigation-panel-select-option-icon side-navigation-panel-select-option-icon-chevron-up"
        {...rest}
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </>
  );
};

export const ChevronUpIcon = React.memo(ChevronUp);
