/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon from 'awesome-react-icons';
import React, {useState} from 'react';
import tw from 'twin.macro';

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

export const Navigation: React.FC<SideNavProps> = ({
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
      {items.map((item) => {
        const ElemBefore = item.elemBefore;

        return (
          <ul key={item.itemId} className="side-navigation">
            <li>
              <div
                onClick={(): void =>
                  item.subNav
                    ? handleSubNavExpand(item)
                    : handleClick(item.itemId)
                }
                css={[
                  tw`hover:bg-gray-100 hover:text-gray-800 hover:border-pink-500 focus:outline-none flex items-center justify-between w-full px-6 py-3 text-gray-700 border-l-2 cursor-pointer`,

                  activeSubNav.selectedId === item.itemId &&
                    tw`text-gray-800 bg-gray-100 border-pink-500`,
                ]}
                className="main-item"
              >
                <span className="flex items-center">
                  {/** Prefix Icon Component */}
                  {ElemBefore && <ElemBefore />}

                  <span className="mx-4 font-medium">{item.title}</span>
                </span>

                {item.subNav && item.subNav.length > 0 && (
                  <Icon
                    name={
                      !activeSubNav.expanded ? 'chevron-down' : 'chevron-up'
                    }
                  />
                )}
              </div>
            </li>

            {item.subNav &&
              // either current item is selected
              (item.itemId === activeSubNav.selectedId ||
                // or some item in the expandable section of the current item is selected or active
                item.subNav.some(
                  (_subNavItem) =>
                    _subNavItem.itemId === activeSubNav.selectedId
                )) &&
              activeSubNav.expanded && (
                <ul className="sub-nav-item">
                  {item.subNav.map((subNavItem) => {
                    return (
                      <li key={subNavItem.itemId}>
                        <div
                          onClick={(): void => handleClick(subNavItem.itemId)}
                          css={[
                            tw`hover:bg-gray-100 hover:text-gray-800 hover:border-pink-500 block px-16 py-2 text-sm text-gray-700 border-l-2 cursor-pointer`,

                            activeSubNav.selectedId === subNavItem.itemId &&
                              tw`text-gray-800 bg-gray-100 border-pink-500`,
                          ]}
                          className="sub-item"
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
    </>
  );
};
