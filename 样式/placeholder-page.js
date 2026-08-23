const root = document.querySelector('#placeholder-root')
const { section, title, description, cover } = document.body.dataset

const coverAssets = {
  collaboration: new URL('../a  图片/page-covers/collaboration.webp', import.meta.url).href,
  contribution: new URL('../a  图片/page-covers/contribution.webp', import.meta.url).href,
  inclusivity: new URL('../a  图片/page-covers/inclusivity.webp', import.meta.url).href,
  model: new URL('../a  图片/page-covers/model.webp', import.meta.url).href,
}

const coverMarkup = coverAssets[cover]
  ? `<section class="image-page-hero" aria-label="${title} cover">
      <img src="${coverAssets[cover]}" width="2848" height="1600" alt="${title} illustrated cover" fetchpriority="high" decoding="async">
    </section>`
  : ''

root.innerHTML = `
  <nav class="navbar" aria-label="Primary navigation">
    <div class="nav-links">
      <div class="dropdown nav-home"><a href="../homepage/index.html" class="nav-link">Home</a></div>
      <div class="dropdown">
        <a href="../Project/description.html" class="nav-link">Project</a>
        <div class="dropdown-content">
          <a href="../Project/description.html">Description</a><a href="../Project/design.html">Design</a>
          <a href="../Project/engineering.html">Engineering</a><a href="../Project/safety.html">Safety</a>
          <a href="../Project/contribution.html">Contribution</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="../Eagagement/iHP.html" class="nav-link">Engagement</a>
        <div class="dropdown-content">
          <a href="../Eagagement/iHP.html">iHP</a><a href="../Eagagement/collaboration.html">Collaboration</a>
          <a href="../Eagagement/inclusity.html">Inclusivity</a><a href="../Eagagement/education.html">Education</a>
          <a href="../Eagagement/entrepreneurship.html">Entrepreneurship</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="../Wet-lab/protocal.html" class="nav-link">Wetlab</a>
        <div class="dropdown-content">
          <a href="../Wet-lab/protocal.html">Protocol</a><a href="../Wet-lab/notebook.html">Notebook</a>
          <a href="../Wet-lab/measurement.html">Measurement</a><a href="../Wet-lab/part.html">Part</a>
          <a href="../Wet-lab/result.html">Result</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="../Instrument/hardware.html" class="nav-link">Instrument</a>
        <div class="dropdown-content">
          <a href="../Instrument/hardware.html">Hardware</a><a href="../Instrument/software.html">Software</a>
          <a href="../Instrument/model.html">Model</a>
        </div>
      </div>
      <div class="dropdown">
        <a href="../Team/member.html" class="nav-link">Team</a>
        <div class="dropdown-content"><a href="../Team/member.html">Member</a><a href="../Team/attribution.html">Attribution</a></div>
      </div>
      <div class="dropdown">
        <a href="../Judging/iHP.html" class="nav-link">Judging</a>
        <div class="dropdown-content"><a href="../Judging/iHP.html">iHP</a><a href="../Judging/model.html">Model</a><a href="../Judging/hardware.html">Hardware</a></div>
      </div>
    </div>
  </nav>
  ${coverMarkup}
  <main class="placeholder-main">
    <section class="placeholder-card">
      <p class="placeholder-kicker">${section}</p>
      <h1>${title}</h1>
      <p>${description}</p>
      <a class="placeholder-home" href="../homepage/index.html">Back to Home</a>
    </section>
  </main>
  <footer class="site-footer">
    <div class="footer-content">
        <div class="school-info"><div class="school-logo">JLU</div><h3>JiLin University</h3><h3>JLU-SPH iGEM Team</h3></div>
      <div class="contact-title">CONTACT WITH US!</div>
      <div class="qr-container">
        <div class="qr-item"><div class="qr-code"></div><span>Instagram</span></div>
        <div class="qr-item"><div class="qr-code"></div><span>RedNote</span></div>
        <div class="qr-item"><div class="qr-code"></div><span>WeChat</span></div>
      </div>
      <div class="sponsor-title">SPONSORS &amp; COOPERATORS</div>
      <div class="sponsors">
        <div class="sponsor-logo">iGEM</div><div class="sponsor-logo">School</div><div class="sponsor-logo">CSC</div>
        <div class="sponsor-logo">Lab</div><div class="sponsor-logo">iGEM</div><div class="sponsor-logo">iGEM</div>
      </div>
        <div class="copyright">© 2026 JLU-SPH. Content licensed under CC BY 4.0.<br>Source code: gitlab.igem.org/2026/jlu-sphera</div>
    </div>
  </footer>`

await import('./main.js')
