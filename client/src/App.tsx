import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CreateBirthdayPage } from './pages/CreateBirthdayPage';
import { SurpriseCreatedPage } from './pages/SurpriseCreatedPage';
import { BirthdayExperiencePage } from './pages/BirthdayExperiencePage';
import { ViewAnswersPage } from './pages/ViewAnswersPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateBirthdayPage />} />
        <Route path="/created/:id" element={<SurpriseCreatedPage />} />
        <Route path="/birthday/:id" element={<BirthdayExperiencePage />} />
        <Route path="/answers/:id" element={<ViewAnswersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
