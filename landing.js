/**
 * Expense Tracker — Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelectorAll('.nav-link, .footer-menu a');

    // 1. Sticky Navbar Shadow & Backdrop Effect on Scroll
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Mobile Navigation Drawer Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
            mobileToggle.classList.toggle('active');
        });
    }

    // 3. Smooth Close Mobile Menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                navbar.classList.remove('menu-open');
                if (mobileToggle) mobileToggle.classList.remove('active');
            }
        });
    });

    // 4. Interactive Hero Bar Chart Animation on Hover
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.style.transform = 'scaleY(1.15)';
            bar.style.transition = 'transform 0.2s ease';
        });
        bar.addEventListener('mouseleave', () => {
            bar.style.transform = 'scaleY(1)';
        });
    });
});
