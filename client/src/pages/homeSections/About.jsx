import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/home.css'


export default function About() {
    return (
      <section className="py-5 bg-dark-subtle w-100">
      <div className="about-section-container">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-primary">About EventEase</h2>
          <p className="text-muted fw-bold">Making event booking easier, one click at a time.</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4 text-center rounded-3">
              <div className="display-5 text-primary mb-3">📅</div>
              <h5 className="fw-bold mb-2">Easy Booking</h5>
              <p className="text-muted">
                Book tickets in seconds — no complicated steps or long forms.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4 text-center rounded-3">
              <div className="display-5 text-primary mb-3">📍</div>
              <h5 className="fw-bold mb-2">Discover Events</h5>
              <p className="text-muted">
                Find exciting events happening near you or online every day.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4 text-center rounded-3">
              <div className="display-5 text-primary mb-3">📱</div>
              <h5 className="fw-bold mb-2">Digital Tickets</h5>
              <p className="text-muted">
                Skip the printouts — receive digital tickets directly to your phone.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4 text-center rounded-3">
              <div className="display-5 text-primary mb-3">⭐</div>
              <h5 className="fw-bold mb-2">Top-Rated Events</h5>
              <p className="text-muted">
                Discover and book events that are highly recommended by our community.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4 text-center rounded-3">
              <div className="display-5 text-primary mb-3">✨</div>
              <h5 className="fw-bold mb-2">Organizer Tools</h5>
              <p className="text-muted">
                Powerful features for event creators to manage and promote their events.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
      );
  }
  