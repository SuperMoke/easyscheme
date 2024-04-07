"use client";
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { SquaresPlusIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react'

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMegaMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen}
              onClick={toggleMegaMenu}
            >
              Entries
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-2 gap-y-2 outline-none outline-0">
            <Link href="/admin/admin_faculty">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    Faculty
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Manage faculty members
                  </Typography>
                </div>
              </MenuItem>
            </Link>

            <Link href="/admin/admin_student">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    Student
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Manage Students
                  </Typography>
                </div>
              </MenuItem>
            </Link>

            <Link href="/admin/admin_rooms">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    Rooms
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Manage Rooms
                  </Typography>
                </div>
              </MenuItem>
            </Link>
            <Link href="/admin/admin_coursentry">
              <MenuItem className="flex items-center gap-3 rounded-lg">
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="flex items-center text-sm font-bold"
                  >
                    Courses
                  </Typography>
                  <Typography
                    variant="paragraph"
                    className="text-xs !font-medium text-blue-gray-500"
                  >
                    Manage Courses
                  </Typography>
                </div>
              </MenuItem>
            </Link>
          </ul>
        </MenuList>
      </Menu>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Link href="/admin">
      <Typography
        as="a"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          Create Schedule
        </ListItem>
      </Typography>
      </Link>
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      ></Typography>
      <NavListMenu />
      <Link href="/admin/admin_profile">
        <Typography
          as="a"
          href="#"
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          <ListItem className="flex items-center gap-2 py-2 pr-4">
            Profile
          </ListItem>
        </Typography>
      </Link>
    </List>
  );
}

export default function NavbarComponent() {
  
  return (
    <div>
      <Navbar className="mx-auto max-w-screen-xl py-3" placeholder={undefined}>
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mt-2 cursor-pointer py-1.5"
            placeholder={undefined}
          >
            EasyScheme
          </Typography>
          <div className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <NavList />
            <Button
              placeholder={undefined}
              className="flex justify-center bg-green-900 ml-2"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
