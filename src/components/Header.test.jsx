import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  it('renders the Placify logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const logoElement = screen.getByText(/Placify/i);
    expect(logoElement).toBeInTheDocument();
  });
});
