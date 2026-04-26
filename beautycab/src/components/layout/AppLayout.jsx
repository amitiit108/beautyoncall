import React from 'react';
import { MapPin, Bell, Smartphone, Home, Search, UserRound, Sparkles, Store, LayoutDashboard } from 'lucide-react';
import { BrandBlock, RoleSwitch, NavButton, OfflineNotice, SupportCard } from '../common/UIComponents';

export function AppLayout({ role, activeTab, setActiveTab, currentUser, handleSignOut, isAdminSignedIn, isFirebaseReady, children }) {
  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <BrandBlock />
        <RoleSwitch role={role} onRoleChange={(next) => setActiveTab(next === 'artist' ? 'artist-login' : 'customer-login')} />
        <nav className="side-nav" aria-label="Workspace">
          <NavButton active={activeTab === 'landing'} onClick={() => setActiveTab('landing')} icon={Store} label="Landing" />
          {role === 'customer' && (
            <>
              <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Book service" />
              <NavButton active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={Search} label="Browse artists" />
              <NavButton active={activeTab === 'track'} onClick={() => setActiveTab('track')} icon={MapPin} label="Booking status" />
              <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserRound} label="Profile" />
            </>
          )}
          {role === 'artist' && (
            <>
              <NavButton active={activeTab === 'artist'} onClick={() => setActiveTab('artist')} icon={Sparkles} label="Artist studio" />
            </>
          )}
          {isAdminSignedIn && <NavButton active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon={LayoutDashboard} label="Admin" />}
          {currentUser && <NavButton active={false} onClick={handleSignOut} icon={UserRound} label="Sign out" />}
        </nav>
        <SupportCard />
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="mobile-brand">
            <p className="eyebrow">BeautyOnCall</p>
            <h1>Premium beauty services at home</h1>
          </div>
          <div className="topbar-actions">
            <span className="city-pill"><MapPin size={15} /> Rewa</span>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="screen">
          <section className="mobile-only">
             <RoleSwitch role={role} onRoleChange={(next) => setActiveTab(next === 'artist' ? 'artist-login' : 'customer-login')} />
          </section>
          {!isFirebaseReady && <OfflineNotice />}
          {children}
        </main>

        <nav className="bottom-nav" aria-label="Primary">
          {role === 'customer' ? (
            <>
              <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Home} label="Home" />
              <NavButton active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={Search} label="Artists" />
              <NavButton active={activeTab === 'track'} onClick={() => setActiveTab('track')} icon={MapPin} label="Track" />
              <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={UserRound} label="Profile" />
            </>
          ) : (
            <>
              <NavButton active={activeTab === 'landing'} onClick={() => setActiveTab('landing')} icon={Store} label="Home" />
              <NavButton active={activeTab === 'artist'} onClick={() => setActiveTab('artist')} icon={Sparkles} label="Studio" />
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
