const ENERGY_PER_HIT = 25;

const XANAX_ENERGY = 250;
const LSD_ENERGY = 50;

const NEWSLETTER_ENERGY = 250;

// Natural energy regeneration
// Donator: 5 energy every 10 minutes = 30/hour
// Non-donator: 5 energy every 15 minutes = 20/hour
const DONATOR_ENERGY_PER_HOUR = 30;
const NON_DONATOR_ENERGY_PER_HOUR = 20;

const DONATOR_MAX_ENERGY = 150;
const NON_DONATOR_MAX_ENERGY = 100;

const POINT_REFILL_ENERGY = 100;
const HOTEL_REFILL_ENERGY = 150;

const REVITALIZE_MIN = 10;
const REVITALIZE_MAX = 24;
const REVITALIZE_DEFAULT = 10;


// ----------------------------------------------------
// ENERGY CANS
// ----------------------------------------------------

const ENERGY_CANS = [
  { id: "canGooseJuice", energy: 5 },
  { id: "canDampValley", energy: 10 },
  { id: "canCrocozade", energy: 15 },
  { id: "canMunster", energy: 20 },
  { id: "canSantaShooters", energy: 20 },
  { id: "canRedCow", energy: 25 },
  { id: "canRockstarRudolph", energy: 25 },
  { id: "canTaurineElite", energy: 30 },
  { id: "canXMass", energy: 30 }
];


// ----------------------------------------------------
// JOB / COMPANY SPECIALS
// ----------------------------------------------------

const JOB_SPECIALS = [
  {
    id: "jobCoffeeBreak",
    energy: 3,
    output: "jobCoffeeBreakEnergy"
  },
  {
    id: "jobPubLunch",
    energy: 3,
    output: "jobPubLunchEnergy"
  },
  {
    id: "jobFreeMeals",
    energy: 3,
    output: "jobFreeMealsEnergy"
  },
  {
    id: "jobReinvigoratingTherapy",
    energy: 5,
    output: "jobReinvigoratingTherapyEnergy"
  },
  {
    id: "jobOverpowered",
    energy: 5,
    output: "jobOverpoweredEnergy"
  },
  {
    id: "jobEarlyRiser",
    energy: 7,
    output: "jobEarlyRiserEnergy"
  }
];

const REGULAR_JOB_JP_LIMIT = 100;
const PRESS_PASS_JP_COST = 25;
const PRESS_PASS_ENERGY = 300;


// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------

function getNumber(id) {
  const element = document.getElementById(id);

  if (!element) {
    return 0;
  }

  const value = parseFloat(element.value);

  return Number.isFinite(value) && value >= 0 ? value : 0;
}


function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function formatNumber(value, decimals = 0) {
  if (!Number.isFinite(value)) {
    value = 0;
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}


function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}


// ----------------------------------------------------
// ENERGY CANS
// ----------------------------------------------------

function calculateCanEnergy() {
  let total = 0;

  ENERGY_CANS.forEach(function(can) {
    const quantity = getNumber(can.id);
    const energy = quantity * can.energy;

    total += energy;

    setText(
      can.id + "Energy",
      formatNumber(energy)
    );
  });

  setText(
    "canTotalEnergy",
    formatNumber(total)
  );

  return total;
}


// ----------------------------------------------------
// JOB / COMPANY SPECIAL ENERGY
// ----------------------------------------------------

function calculateJobEnergy() {
  let regularJP = 0;
  let regularEnergy = 0;

  JOB_SPECIALS.forEach(function(job) {
    const jp = getNumber(job.id);

    regularJP += jp;

    const energy = jp * job.energy;

    regularEnergy += energy;

    setText(
      job.output,
      formatNumber(energy)
    );
  });

  const allowedRegularJP = Math.min(
    regularJP,
    REGULAR_JOB_JP_LIMIT
  );

  if (regularJP > REGULAR_JOB_JP_LIMIT) {
    regularEnergy =
      regularEnergy *
      (allowedRegularJP / regularJP);
  }


  // --------------------------------------------------
  // PRESS PASS
  // --------------------------------------------------

  const pressPassJP = getNumber("jobPressPass");

  const pressPassUses = Math.floor(
    pressPassJP / PRESS_PASS_JP_COST
  );

  const pressPassEnergy =
    pressPassUses * PRESS_PASS_ENERGY;

  setText(
    "regularJobJP",
    formatNumber(allowedRegularJP)
  );

  setText(
    "pressPassJP",
    formatNumber(pressPassJP)
  );

  setText(
    "jobPressPassEnergy",
    formatNumber(pressPassEnergy)
  );

  const totalJobEnergy =
    regularEnergy + pressPassEnergy;

  setText(
    "jobTotalEnergy",
    formatNumber(totalJobEnergy)
  );

  return totalJobEnergy;
}


// ----------------------------------------------------
// REFILLS / NATURAL ENERGY
// ----------------------------------------------------

function calculateRefillEnergy() {
  const inactivityHours =
    getNumber("inactivityHours");

  const donatorToggle =
    document.getElementById("donatorStatus");

  const isDonator =
    donatorToggle
      ? donatorToggle.checked
      : false;


  // --------------------------------------------------
  // NATURAL REFILL RATE
  // --------------------------------------------------

  const refillRate =
    isDonator
      ? DONATOR_ENERGY_PER_HOUR
      : NON_DONATOR_ENERGY_PER_HOUR;


  // --------------------------------------------------
  // MAX NATURAL ENERGY
  // --------------------------------------------------

  const maxEnergy =
    isDonator
      ? DONATOR_MAX_ENERGY
      : NON_DONATOR_MAX_ENERGY;


  // --------------------------------------------------
  // INACTIVITY ENERGY
  // --------------------------------------------------

  const inactivityEnergy =
    Math.min(
      inactivityHours * refillRate,
      maxEnergy
    );


  // --------------------------------------------------
  // POINT REFILLS
  // --------------------------------------------------

  const pointRefills =
    getNumber("pointRefills");

  const pointEnergy =
    pointRefills * POINT_REFILL_ENERGY;


  // --------------------------------------------------
  // FEATHERY HOTEL COUPONS
  // --------------------------------------------------

  const hotelRefills =
    getNumber("hotelRefills");

  const hotelEnergy =
    hotelRefills * HOTEL_REFILL_ENERGY;


  // --------------------------------------------------
  // DISPLAY
  // --------------------------------------------------

  setText(
    "refillRate",
    formatNumber(refillRate) +
      " energy/hour"
  );

  setText(
    "inactivityRefillEnergy",
    formatNumber(inactivityEnergy)
  );

  setText(
    "pointRefillEnergy",
    formatNumber(pointEnergy)
  );

  setText(
    "hotelRefillEnergy",
    formatNumber(hotelEnergy)
  );


  return (
    inactivityEnergy +
    pointEnergy +
    hotelEnergy
  );
}


// ----------------------------------------------------
// DONATOR STATUS
// ----------------------------------------------------

function updateDonatorStatus() {
  const toggle =
    document.getElementById("donatorStatus");

  const statusText =
    document.getElementById("donatorStatusText");

  if (!toggle || !statusText) {
    return;
  }

  statusText.textContent =
    toggle.checked
      ? "ON"
      : "OFF";
}


// ----------------------------------------------------
// MAIN ENERGY CALCULATOR
// ----------------------------------------------------

function calculateEnergy() {
  const targetHits =
    getNumber("targetHits");

  const currentEnergy =
    getNumber("currentEnergy");

  const xanaxQty =
    getNumber("xanaxQty");

  const lsdQty =
    getNumber("lsdQty");


  // --------------------------------------------------
  // REQUIRED ENERGY
  // --------------------------------------------------

  const requiredEnergy =
    targetHits * ENERGY_PER_HIT;


  // --------------------------------------------------
  // ITEMS
  // --------------------------------------------------

  const xanaxEnergy =
    xanaxQty * XANAX_ENERGY;

  const lsdEnergy =
    lsdQty * LSD_ENERGY;


  // --------------------------------------------------
  // NEWSLETTER
  // --------------------------------------------------

  const newsletterElement =
    document.getElementById("newsletter");

  const newsletterEnergy =
    newsletterElement &&
    newsletterElement.checked
      ? NEWSLETTER_ENERGY
      : 0;


  // --------------------------------------------------
  // OTHER ENERGY SOURCES
  // --------------------------------------------------

  const canEnergy =
    calculateCanEnergy();

  const refillEnergy =
    calculateRefillEnergy();

  const jobEnergy =
    calculateJobEnergy();


  // --------------------------------------------------
  // TOTAL ENERGY
  // --------------------------------------------------

  const totalEnergy =
    currentEnergy +
    xanaxEnergy +
    lsdEnergy +
    newsletterEnergy +
    canEnergy +
    refillEnergy +
    jobEnergy;


  const energyDifference =
    totalEnergy - requiredEnergy;


  // --------------------------------------------------
  // DISPLAY RESULTS
  // --------------------------------------------------

  setText(
    "requiredEnergy",
    formatNumber(requiredEnergy)
  );

  setText(
    "currentEnergyResult",
    formatNumber(currentEnergy)
  );

  setText(
    "xanaxEnergy",
    formatNumber(xanaxEnergy)
  );

  setText(
    "lsdEnergy",
    formatNumber(lsdEnergy)
  );

  setText(
    "newsletterEnergy",
    formatNumber(newsletterEnergy)
  );

  setText(
    "canEnergy",
    formatNumber(canEnergy)
  );

  setText(
    "refillEnergy",
    formatNumber(refillEnergy)
  );

  setText(
    "jobEnergy",
    formatNumber(jobEnergy)
  );

  setText(
    "totalEnergy",
    formatNumber(totalEnergy)
  );


  // --------------------------------------------------
  // ENERGY DIFFERENCE
  // --------------------------------------------------

  if (energyDifference >= 0) {
    setText(
      "energyDifference",
      "+" + formatNumber(energyDifference)
    );
  } else {
    setText(
      "energyDifference",
      formatNumber(energyDifference)
    );
  }


  // --------------------------------------------------
  // PROGRESS
  // --------------------------------------------------

  const progress =
    requiredEnergy > 0
      ? clamp(
          (totalEnergy / requiredEnergy) * 100,
          0,
          100
        )
      : 0;

  setText(
    "energyProgressText",
    formatNumber(progress, 1) + "%"
  );

  const progressBar =
    document.getElementById(
      "energyProgressBar"
    );

  if (progressBar) {
    progressBar.style.width =
      progress + "%";
  }


  // --------------------------------------------------
  // POSSIBLE HITS
  // --------------------------------------------------

  const possibleHits =
    Math.floor(
      totalEnergy / ENERGY_PER_HIT
    );

  setText(
    "hitResult",
    formatNumber(possibleHits) +
      " hits"
  );


  // --------------------------------------------------
  // REVITALIZE
  // --------------------------------------------------

  const revitalizeHits =
    document.getElementById(
      "revitalizeHits"
    );

  if (
    revitalizeHits &&
    document.activeElement !== revitalizeHits
  ) {
    revitalizeHits.value =
      targetHits;
  }

  calculateRevitalize();
}


// ----------------------------------------------------
// REVITALIZE
// ----------------------------------------------------

function calculateRevitalize() {
  const chanceInput =
    document.getElementById(
      "revitalizeChance"
    );

  const hitsInput =
    document.getElementById(
      "revitalizeHits"
    );

  if (!chanceInput || !hitsInput) {
    return;
  }


  let chance =
    parseFloat(
      chanceInput.value
    );

  if (!Number.isFinite(chance)) {
    chance =
      REVITALIZE_DEFAULT;
  }

  chance =
    clamp(
      Math.round(chance),
      REVITALIZE_MIN,
      REVITALIZE_MAX
    );

  chanceInput.value =
    chance;


  let hits =
    parseFloat(
      hitsInput.value
    );

  if (
    !Number.isFinite(hits) ||
    hits < 0
  ) {
    hits = 0;
  }


  const totalExpectedHits =
    hits /
    (1 - chance / 100);

  const bonusHits =
    totalExpectedHits - hits;


  setText(
    "revitalizeChanceResult",
    chance + "%"
  );

  setText(
    "revitalizeHitsResult",
    formatNumber(hits)
  );

  setText(
    "revitalizeBonusHits",
    formatNumber(
      bonusHits,
      2
    )
  );

  setText(
    "revitalizeTotalHits",
    formatNumber(
      totalExpectedHits,
      2
    )
  );


  const progressText =
    document.getElementById(
      "revitalizeProgressText"
    );

  if (progressText) {
    progressText.textContent =
      chance + "%";
  }


  const progressBar =
    document.getElementById(
      "revitalizeProgressBar"
    );

  if (progressBar) {
    const progress =
      (
        (chance - REVITALIZE_MIN) /
        (REVITALIZE_MAX - REVITALIZE_MIN)
      ) * 100;

    progressBar.style.width =
      clamp(
        progress,
        0,
        100
      ) + "%";
  }
}


// ----------------------------------------------------
// INPUT LISTENERS
// ----------------------------------------------------

function attachInputListeners() {

  const inputs =
    document.querySelectorAll(
      'input[type="number"]'
    );


  inputs.forEach(function(input) {

    input.addEventListener(
      "input",
      function() {

        if (
          input.id === "revitalizeChance" ||
          input.id === "revitalizeHits"
        ) {

          calculateRevitalize();

        } else {

          calculateEnergy();

        }

      }
    );


    input.addEventListener(
      "change",
      function() {

        if (
          input.id === "revitalizeChance" ||
          input.id === "revitalizeHits"
        ) {

          calculateRevitalize();

        } else {

          calculateEnergy();

        }

      }
    );

  });


  // --------------------------------------------------
  // NEWSLETTER
  // --------------------------------------------------

  const newsletter =
    document.getElementById(
      "newsletter"
    );

  if (newsletter) {

    newsletter.addEventListener(
      "change",
      calculateEnergy
    );

  }


  // --------------------------------------------------
  // DONATOR TOGGLE
  // --------------------------------------------------

  const donatorStatus =
    document.getElementById(
      "donatorStatus"
    );

  if (donatorStatus) {

    donatorStatus.addEventListener(
      "change",
      function() {

        updateDonatorStatus();

        calculateEnergy();

      }
    );

  }

}


// ----------------------------------------------------
// START
// ----------------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  function() {

    attachInputListeners();

    updateDonatorStatus();

    calculateEnergy();

    calculateRevitalize();

  }
);
