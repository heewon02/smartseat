// contexts/SelectedSubjectContext.tsx
import React, { createContext, useContext, useState } from 'react';

type SelectedSubjectContextType = {
  selectedSubject: string | null;
  setSelectedSubject: (name: string | null) => void;
};

const SelectedSubjectContext = createContext<SelectedSubjectContextType | null>(null);

export function SelectedSubjectProvider({ children }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <SelectedSubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
      {children}
    </SelectedSubjectContext.Provider>
  );
}

export function useSelectedSubject() {
  const ctx = useContext(SelectedSubjectContext);
  if (!ctx) {
    throw new Error('SelectedSubjectProvider가 감싸고 있지 않습니다.');
  }
  return ctx;
}
