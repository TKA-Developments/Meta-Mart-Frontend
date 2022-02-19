import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { classNames } from "../../util/style";

type ComponentInFlyoutMenu = {
  open: boolean;
};

export type FlyoutMenuProps = {
  titleComponent: (props: ComponentInFlyoutMenu) => JSX.Element;
  popoverComponent: (props: ComponentInFlyoutMenu) => JSX.Element;
  containerProps: any;
  panelProps: any;
  buttonProps: any;
};

export const FlyoutMenu = ({
  titleComponent: TitleComponent = (props: ComponentInFlyoutMenu) => <></>,
  popoverComponent: PopoverComponent = (props: ComponentInFlyoutMenu) => <></>,
  containerProps,
  panelProps,
  buttonProps,
}: FlyoutMenuProps) => {
  const buttonRef = useRef<null | any>(null);

  const toggleDropdown = useCallback(() => buttonRef?.current.click(), []);

  return (
    <Popover
      {...containerProps}
      onMouseEnter={toggleDropdown}
      onMouseLeave={toggleDropdown}
    >
      {({ open }) => (
        <>
          <Popover.Button ref={buttonRef} {...buttonProps}>
            <TitleComponent open={open} />
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel static {...panelProps}>
              <PopoverComponent open={open} />
            </Popover.Panel>
          </Transition>
        </>
        // </div>
      )}
    </Popover>
  );
};
