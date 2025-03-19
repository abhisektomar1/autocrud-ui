import { useLocation, useNavigate } from "react-router-dom";
import { classNames } from "../utils/string";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
interface Navigation {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}
interface Resources {
  id: number;
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  initial: string;
  current: boolean;
}
export default function NavLayout({
  navigation,
  resources,
}: {
  navigation: Navigation[];
  resources: Resources[];
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name} className="cursor-pointer">
                <button
                  //   href={item.href}
                  onClick={() => {
                    navigate(item.href);
                  }}
                  className={classNames(
                    item.href === pathname
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md p-2 cursor-pointer text-sm font-semibold leading-6"
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.href === pathname
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Other Resources
          </div>
          <ul className="-mx-2 mt-2 space-y-1">
            {resources.map((resource) => (
              <li key={resource.name} className="cursor-pointer">
                <button
                  onClick={() =>
                    window.open(
                      `${resource.href}`,
                      "_blank",
                      "rel=noopener noreferrer"
                    )
                  }
                  className={classNames(
                    resource.href === pathname
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 cursor-pointer rounded-md p-2 text-sm font-semibold leading-6"
                  )}
                >
                  <span
                    className={classNames(
                      resource.href === pathname
                        ? "border-indigo-600 text-indigo-600"
                        : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                    )}
                  >
                    {resource.initial}
                  </span>
                  <span className="truncate">{resource.name}</span>
                  <resource.icon
                    className={classNames(
                      "text-gray-400 group-hover:text-indigo-600",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <button
            onClick={() => {
              navigate("/settings");
            }}
            className="group -mx-2 cursor-pointer flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
          >
            <Cog6ToothIcon
              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
              aria-hidden="true"
            />
            Settings
          </button>
        </li>
      </ul>
    </nav>
  );
}
