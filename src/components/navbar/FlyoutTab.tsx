import { Fragment, useRef, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { classNames } from "../../util/style";

type ComponentInFlyoutMenu = {
  open: boolean;
};

export const FlyoutMenu = ({
  titleComponent: TitleComponent = (props: ComponentInFlyoutMenu) => <></>,
  popoverComponent: PopoverComponent = (props: ComponentInFlyoutMenu) => <></>,
  containerProps,
  panelProps,
}) => {
  let timeout: NodeJS.Timeout;
  const timeoutDuration = 400;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = (open: boolean) => {
    // log the current open state in React (toggle open state)
    setOpenState((openState) => !openState);
    // toggle the menu by clicking on buttonRef
    buttonRef?.current?.click(); // eslint-disable-line
  };

  // Open the menu after a delay of timeoutDuration
  const onHover = (open: boolean, action) => {
    // if the modal is currently closed, we need to open it
    // OR
    // if the modal is currently open, we need to close it
    if (
      (!open && !openState && action === "onMouseEnter") ||
      (open && openState && action === "onMouseLeave")
    ) {
      // clear the old timeout, if any
      clearTimeout(timeout);
      // open the modal after a timeout
      timeout = setTimeout(() => toggleMenu(open), timeoutDuration);
    }
    // else: don't click! 😁
  };

  const handleClick = (open: boolean) => {
    setOpenState(!open); // toggle open state in React state
    clearTimeout(timeout); // stop the hover timer if it's running
  };
  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  return (
    <Popover {...containerProps}>
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, "onMouseEnter")}
          onMouseLeave={() => onHover(open, "onMouseLeave")}
          {...containerProps}
        >
          <Popover.Button ref={buttonRef}>
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
        </div>
      )}
    </Popover>
  );
};
