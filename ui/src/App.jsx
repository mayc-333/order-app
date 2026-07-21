import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('order')

  if (activePage === 'order') {
    return <OrderPage onNavigate={setActivePage} />
  }

  return (
    <div className="page">
      <Header activePage="admin" onNavigate={setActivePage} />
      <div className="app">
        <main className="placeholder-page">
          <p>관리자 화면은 추후 구현 예정입니다.</p>
        </main>
      </div>
    </div>
  )
}

export default App
