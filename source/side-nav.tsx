/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useState} from 'react';

import {ChevronDownIcon, ChevronUpIcon} from './icon';

import './styles.scss';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ElemBefore: React.ReactNode;
    }
  }
}

export type NavItemProps = {
  title: string;
  itemId: string;
  disable?: boolean;
  elemBefore?: React.FC<unknown>;
  subNav?: NavItemProps[];
};

export type SideNavProps = {
  items: NavItemProps[];
  activeItemId: string;
  onSelect?: ({itemId}: {itemId: string}) => void;
};

const Navigation: React.FC<SideNavProps> = ({
  activeItemId,
  onSelect,
  items,
}) => {
  const [activeSubNav, setActiveSubNav] = useState({
    expanded: true,
    selectedId: activeItemId,
  });

  function handleClick(itemId: string): void {
    if (onSelect) {
      onSelect({itemId});
    }
  }

  function handleSubNavExpand(item: NavItemProps): void {
    if (activeSubNav.expanded) {
      const currentItemOrSubNavItemIsOpen: boolean =
        // either the parent item is expanded already
        item.itemId === activeSubNav.selectedId ||
        (item.subNav &&
          // or a subitem is active
          item.subNav.some(
            (_subNavItem) => _subNavItem.itemId === activeSubNav.selectedId
          )) ||
        false;

      setActiveSubNav({
        expanded: !currentItemOrSubNavItemIsOpen,
        selectedId: item.itemId,
      });
    } else {
      setActiveSubNav({
        expanded: true,
        selectedId: item.itemId,
      });
    }
  }

  return (
    <>
      {items.length > 0 && (
        <nav
          role="navigation"
          aria-label="side-navigation"
          className="side-navigation-panel"
        >
          {items.map((item) => {
            const ElemBefore = item.elemBefore;
            const isActiveTab: boolean =
              // item is expanded and
              activeSubNav.expanded &&
              // either the current expandable section is selected
              (item.itemId === activeSubNav.selectedId ||
                // or some item in the expandable section of the current item is selected or active
                (item.subNav &&
                  item.subNav.some(
                    (_subNavItem) =>
                      _subNavItem.itemId === activeSubNav.selectedId
                  )) ||
                false);

            return (
              <ul key={item.itemId} className="side-navigation-panel-select">
                <li className="side-navigation-panel-select-wrap">
                  <div
                    onClick={(): void =>
                      item.subNav
                        ? handleSubNavExpand(item)
                        : handleClick(item.itemId)
                    }
                    className={`side-navigation-panel-select-option hover:bg-gray-100 hover:text-gray-800 hover:border-pink-500 focus:outline-none flex items-center justify-between w-full px-6 py-3 text-gray-700 border-l-2 cursor-pointer ${
                      activeSubNav.selectedId === item.itemId
                        ? 'side-navigation-panel-select-option-selected text-gray-800 bg-gray-100 border-pink-500'
                        : ''
                    }`}
                  >
                    <span className="side-navigation-panel-select-option-wrap flex items-center">
                      {/** Prefix Icon Component */}
                      {ElemBefore && <ElemBefore />}

                      <span className="side-navigation-panel-select-option-text mx-4 font-medium">
                        {item.title}
                      </span>
                    </span>

                    {item.subNav &&
                      item.subNav.length > 0 &&
                      (isActiveTab ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                  </div>
                </li>

                {item.subNav && isActiveTab && (
                  <ul className="side-navigation-panel-select-inner">
                    {item.subNav.map((subNavItem) => {
                      return (
                        <li
                          key={subNavItem.itemId}
                          className="side-navigation-panel-select-inner-wrap"
                        >
                          <div
                            onClick={(): void => handleClick(subNavItem.itemId)}
                            className={`side-navigation-panel-select-inner-option hover:bg-gray-100 hover:text-gray-800 hover:border-pink-500 block px-16 py-2 text-sm text-gray-700 border-l-2 cursor-pointer ${
                              activeSubNav.selectedId === subNavItem.itemId
                                ? 'side-navigation-panel-select-inner-option-selected text-gray-800 bg-gray-100 border-pink-500'
                                : ''
                            } `}
                          >
                            {subNavItem.title}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ul>
            );
          })}
        </nav>
      )}
    </>
  );
};

export default Navigation;
