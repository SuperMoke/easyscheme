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
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/signin");
  };

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
            <Button
              placeholder={undefined}
              className="flex justify-center bg-green-900 ml-2"
              onClick={handleClick}
            >
              Login
            </Button>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
