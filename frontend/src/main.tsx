import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Contacts } from './pages/Contacts'
import { Home } from './pages/Home'
import { News, NewsPost } from './pages/News'
import { NotFound } from './pages/NotFound'
import { Products } from './pages/Products'
import { Publications } from './pages/Publications'
import { Team } from './pages/Team'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Team />} />
          <Route path="publications" element={<Publications />} />
          <Route path="products" element={<Products />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsPost />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
