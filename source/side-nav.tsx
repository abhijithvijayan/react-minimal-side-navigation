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
  htmlId?: string;
  // disabled?: boolean;
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

  // Listen for parent prop changes and update state
  React.useEffect(() => {
    setActiveSubNav((originalSubNav) => ({
      expanded: originalSubNav.expanded,
      selectedId: activeItemId,
    }));
  }, [activeItemId]);

  function handleClick(itemId: string): void {
    // call the callback if supplied
    onSelect?.({itemId});
  }

  function handleSubNavExpand(item: NavItemProps): void {
    if (activeSubNav.expanded) {
      const currentItemOrSubNavItemIsOpen: boolean =
        // either the parent item is expanded already
        item.itemId === activeSubNav.selectedId ||
        // or one of its expandable children is selected
        (item.subNav &&
          item.subNav.some(
            (_subNavItem) => _subNavItem.itemId === activeSubNav.selectedId
          )) ||
        false;

      setActiveSubNav({
        expanded:
          item.subNav && item.subNav.length > 0
            ? !currentItemOrSubNavItemIsOpen
            : false, // disable expansion value, if not expandable
        selectedId: item.itemId,
      });
    } else {
      setActiveSubNav({
        expanded: !!(item.subNav && item.subNav.length > 0), // expand if expandable
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
          {items.map((item: NavItemProps) => {
            const ElemBefore = item.elemBefore;
            const isItemSelected: boolean =
              item.itemId === activeSubNav.selectedId;
            const isActiveTab: boolean =
              // item is expanded and
              activeSubNav.expanded &&
              // either the current expandable section is selected
              (isItemSelected ||
                // or some item in the expandable section of the current item is selected or active
                (item.subNav &&
                  item.subNav.some(
                    (_subNavItem: NavItemProps) =>
                      _subNavItem.itemId === activeSubNav.selectedId
                  )) ||
                false);

            return (
              <ul key={item.itemId} className="side-navigation-panel-select">
                <li className="side-navigation-panel-select-wrap">
                  <div
				    id={item.htmlId}
                    onClick={(): void => {
                      handleSubNavExpand(item);
                      handleClick(item.itemId);
                    }}
                    className={`side-navigation-panel-select-option ${
                      isItemSelected
                        ? 'side-navigation-panel-select-option-selected'
                        : ''
                    }`}
                  >
                    <span className="side-navigation-panel-select-option-wrap">
                      {/** Prefix Icon Component */}
                      {ElemBefore && <ElemBefore />}

                      <span className="side-navigation-panel-select-option-text">
                        {item.title}
                      </span>
                    </span>

                    {item.subNav &&
                      item.subNav.length > 0 &&
                      (isActiveTab ? <ChevronUpIcon /> : <ChevronDownIcon />)}
                  </div>
                </li>

                {item.subNav && item.subNav.length > 0 && isActiveTab && (
                  <ul className="side-navigation-panel-select-inner">
                    {item.subNav.map((subNavItem: NavItemProps) => {
                      const SubItemElemBefore = subNavItem.elemBefore;

                      return (
                        <li
                          key={subNavItem.itemId}
                          className="side-navigation-panel-select-inner-wrap"
                        >
                          <div
                            onClick={(): void => {
                              setActiveSubNav({
                                ...activeSubNav,
                                selectedId: subNavItem.itemId,
                              });
                              handleClick(subNavItem.itemId);
                            }}
                            className={`side-navigation-panel-select-inner-option ${
                              activeSubNav.selectedId === subNavItem.itemId
                                ? 'side-navigation-panel-select-inner-option-selected'
                                : ''
                            } `}
                          >
                            <span className="side-navigation-panel-select-inner-option-wrap">
                              {/** Prefix Icon Component */}
                              {SubItemElemBefore && <SubItemElemBefore />}

                              <span className="side-navigation-panel-select-inner-option-text">
                                {subNavItem.title}
                              </span>
                            </span>
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
