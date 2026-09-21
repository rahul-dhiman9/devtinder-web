import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-base-content/10 bg-base-300 text-base-content fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-sm opacity-60">
          © {new Date().getFullYear()} DevTinder. All rights reserved.
        </p>

        <div className="flex items-center gap-2">
          <a href="#" className="btn btn-ghost btn-circle btn-sm" aria-label="GitHub">
            <FaGithub size={18} />
          </a>

          <a href="#" className="btn btn-ghost btn-circle btn-sm" aria-label="LinkedIn">
            <FaLinkedin size={18} />
          </a>

          <a href="#" className="btn btn-ghost btn-circle btn-sm" aria-label="Instagram">
            <FaInstagram size={18} />
          </a>

          <a href="#" className="btn btn-ghost btn-circle btn-sm" aria-label="Twitter">
            <FaTwitter size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;