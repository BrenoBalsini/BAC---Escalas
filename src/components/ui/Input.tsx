import {
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type RootProps = {
  children: ReactNode;
  className?: string;
};

export function Root({ children, className }: RootProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}


type FormFieldProps = InputHTMLAttributes<HTMLInputElement>;

export function FromField(props: FormFieldProps) {
  return (
    <div>
      <input
        {...props}
        className={twMerge(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
          props.className
        )}
      />
    </div>
  );
}

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps) {
  return (
    <label
      {...props}
      className={twMerge("block mb-2 text-sm font-medium", props.className)}
    />
  );
}
