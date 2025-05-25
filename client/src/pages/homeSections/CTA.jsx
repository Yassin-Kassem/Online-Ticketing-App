import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
import '../stylesheets/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CTA() {
    return (
        <section className="py-5 text-white cta-bg d-flex align-items-center justify-content-center">
        <div className="text-content p-3">
            <h2 className="fw-bold text-white display-5 mb-3">Your Vision, Our Platform</h2>
            <p className="lead mb-4">
            Discover, book, and manage events effortlessly — all in one place.
            </p>
            <a href="/events" className="btn-transparent btn-lg">
            View Events Now
            </a>
        </div>
        {/* Lottie Animation */}
        <div className="lottie-container p-3 d-none d-md-block">
            <DotLottieReact
            src="https://lottie.host/aa04fdf2-4448-4d05-ba85-4927f61cf96d/UyQ3SpOukB.lottie "
            loop
            autoplay
            style={{ width: '100%', height: 'auto', alignSelf: "auto" }}
            />
        </div>
</section>
    )
};