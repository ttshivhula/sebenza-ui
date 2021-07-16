import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { userState } from "store/user";
import { sessionState } from "store/session";
import { useRecoilState, useSetRecoilState } from "recoil";

const profile = ["Sign out"];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Header({ navigation, ...props }) {
  const [userStore, setUserState] = useRecoilState(userState);
  const setSessionState = useSetRecoilState(sessionState);

  const userInitials = (user) => {
    return `${user.firstName.charAt(0).toUpperCase()}${user.lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  const signOut = () => {
    setUserState((oldUser) => {
      return {
        user: null,
        token: null,
      };
    });

    setSessionState((old) => {
      return {
        toast: {
          heading: "Success!",
          message: "Signed out successfully",
        },
      };
    });
  };

  return (
    <Disclosure as="nav" className="bg-indigo-600">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item, itemIdx) =>
                      itemIdx === 0 ? (
                        <Fragment key={item.name}>
                          <Link
                            to={item.to}
                            className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {item.name}
                          </Link>
                        </Fragment>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.to}
                          className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-400">
                              <span className="text-xs font-medium leading-none text-white">
                                {userInitials(userStore.user)}
                              </span>
                            </span>
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {profile.map((item) => (
                              <Menu.Item key={item}>
                                {({ active }) => (
                                  <div
                                    key={item}
                                    onClick={signOut}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item}
                                  </div>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item, itemIdx) =>
                itemIdx === 0 ? (
                  <Fragment key={item.name}>
                    <Link
                      to={item.name}
                      className="bg-indigo-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  </Fragment>
                ) : (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-white hover:bg-indigo-500 hover:bg-opacity-75 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-400">
                    <span className="text-xs font-medium leading-none text-white">
                      {userInitials(userStore.user)}
                    </span>
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {userStore.user.firstName}
                    <span className="pl-1">{userStore.user.lastName}</span>
                  </div>
                  <div className="text-sm font-medium text-indigo-300">
                    {userStore.user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {profile.map((item) => (
                  <div
                    key={item}
                    onClick={signOut}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Header;
