import React, { PropsWithChildren } from "react";

export const ModalTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return <span className="text-lg font-normal text-white">{children}</span>;
};
