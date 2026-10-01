import React, { PropsWithChildren } from "react";

export const ModalSubtitle: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-sm font-light text-gray-300">{children}</div>;
};
