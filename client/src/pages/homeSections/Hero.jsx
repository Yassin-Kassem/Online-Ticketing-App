import 'bootstrap/dist/css/bootstrap.min.css'
import '../stylesheets/home.css'

export default function Hero() {
    return (
      <section className="hero">
      <h1 className="display-4 fw-bold mb-3">Welcome to EventEase</h1>
      <p className="lead mb-4">
        Your one-stop platform for discovering and booking events effortlessly.
      </p>
      <a href="/register" className="btn-transparent btn-lg">
        Get Started
      </a>
    </section>
      );
}
