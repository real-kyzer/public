"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function AutoBreadcrumb() {
  const pathname = usePathname();
  const splitPathName = pathname.split("/");

  return (
    <Breadcrumb className="-mt-3 pb-5">
      <BreadcrumbList>
        {splitPathName.map((value, index) => {
          if (index == splitPathName.length - 1) {
            return null;
          }

          return (
            <React.Fragment key={value.length > 0 ? value : "Home"}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${value}`}
                  className="relative text-xl capitalize text-primary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:after:origin-left hover:after:scale-x-100"
                >
                  {value.length > 0 ? value : "Home"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {splitPathName.length - 2 > index ? (
                <BreadcrumbSeparator className="text-primary" />
              ) : null}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
