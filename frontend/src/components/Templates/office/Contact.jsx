import { email } from "./index";

const Contact = () => {
  return (
    <section id="contact" className="relative w-full py-20 mx-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-900/70 p-8 rounded-2xl backdrop-blur-sm border border-blue-400/20">
          <h2 className="text-blue-400 text-4xl font-bold mb-6">
            Let's Collaborate
          </h2>
          <p className="text-white mb-6">
            Reach out at <span className="text-blue-400">{email}</span> or use the form below.
          </p>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-white">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="bg-gray-800 border border-blue-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-800 border border-blue-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white">
                Project Details
              </label>
              <textarea
                id="message"
                rows="5"
                className="bg-gray-800 border border-blue-400/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tell me about your project requirements..."
              />
            </div>

            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300 self-start"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;