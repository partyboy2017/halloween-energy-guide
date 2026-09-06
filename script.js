const ENERGY_PER_HIT = 25;

const XANAX_ENERGY = 250;
const LSD_ENERGY = 50;

const NEWSLETTER_ENERGY = 250;

const DONATOR_ENERGY_PER_HOUR = 5;
const NON_DONATOR_ENERGY_PER_HOUR = 5;

const DONATOR_MAX_ENERGY = 150;
const NON_DONATOR_MAX_ENERGY = 100;

const POINT_REFILL_ENERGY = 100;
const HOTEL_REFILL_ENERGY = 150;

const REVITALIZE_MIN = 10;
const REVITALIZE_MAX = 24;
const REVITALIZE_DEFAULT = 10;


/*
 * Torn energy drinks
 *
 * Base energy values from the Torn Wiki.
 */
const ENERGY_CANS = [
    {
        id: "canGooseJuice",
        energy: 5
    },
    {
        id: "canDampValley",
        energy: 10
    },
    {
        id: "canCrocozade",
        energy: 15
    },
    {
        id: "canMunster",
        energy: 20
    },
    {
        id: "canSantaShooters",
        energy: 20
    },
    {
        id: "canRedCow",
        energy: 25
    },
    {
        id: "canRockstarRudolph",
        energy: 25
    },
    {
        id: "canTaurineElite",
        energy: 30
    },
    {
        id: "canXMass",
        energy: 30
    }
];


// ------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = parseFloat(element.value);

    return Number.isFinite(value) && value >= 0
        ? value
        : 0;
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

    return Math.min(
        max,
        Math.max(min, value)
    );
}


// ------------------------------------------------------------
// Energy can calculations
// ------------------------------------------------------------

function calculateCanEnergy() {

    let total = 0;

    ENERGY_CANS.forEach(function (can) {

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


// ------------------------------------------------------------
// Energy refills
// ------------------------------------------------------------

function calculateRefillEnergy() {

    const inactivityHours = getNumber("inactivityHours");

    const donatorToggle =
        document.getElementById("donatorStatus");

    const isDonator =
        donatorToggle
            ? donatorToggle.checked
            : false;


    /*
     * Torn naturally regenerates 5 energy per hour.
     *
     * Donator:
     * 150 maximum energy
     *
     * Non-donator:
     * 100 maximum energy
     *
     * For this planner, inactivity hours represent
     * the amount of natural regeneration being counted.
     */
    const refillRate = isDonator
        ? DONATOR_ENERGY_PER_HOUR
        : NON_DONATOR_ENERGY_PER_HOUR;

    const maxEnergy = isDonator
        ? DONATOR_MAX_ENERGY
        : NON_DONATOR_MAX_ENERGY;


    /*
     * Cap natural regeneration at the player's
     * normal maximum energy bar.
     */
    const inactivityEnergy = Math.min(
        inactivityHours * refillRate,
        maxEnergy
    );


    const pointRefills =
        getNumber("pointRefills");

    const hotelRefills =
        getNumber("hotelRefills");


    const pointEnergy =
        pointRefills * POINT_REFILL_ENERGY;

    const hotelEnergy =
        hotelRefills * HOTEL_REFILL_ENERGY;


    setText(
        "refillRate",
        formatNumber(refillRate) + " energy/hour"
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


// ------------------------------------------------------------
// Donator status display
// ------------------------------------------------------------

function updateDonatorStatus() {

    const toggle =
        document.getElementById("donatorStatus");

    const statusText =
        document.getElementById("donatorStatusText");

    if (!toggle || !statusText) {
        return;
    }

    if (toggle.checked) {

        statusText.textContent = "ON";

    } else {

        statusText.textContent = "OFF";
    }
}


// ------------------------------------------------------------
// Main energy calculator
// ------------------------------------------------------------

function calculateEnergy() {

    const targetHits =
        getNumber("targetHits");

    const currentEnergy =
        getNumber("currentEnergy");

    const xanaxQty =
        getNumber("xanaxQty");

    const lsdQty =
        getNumber("lsdQty");


    const requiredEnergy =
        targetHits * ENERGY_PER_HIT;


    const xanaxEnergy =
        xanaxQty * XANAX_ENERGY;

    const lsdEnergy =
        lsdQty * LSD_ENERGY;


    const newsletterElement =
        document.getElementById("newsletter");

    const newsletterEnergy =
        newsletterElement &&
        newsletterElement.checked
            ? NEWSLETTER_ENERGY
            : 0;


    const canEnergy =
        calculateCanEnergy();


    const refillEnergy =
        calculateRefillEnergy();


    const totalEnergy =
        currentEnergy +
        xanaxEnergy +
        lsdEnergy +
        newsletterEnergy +
        canEnergy +
        refillEnergy;


    const energyDifference =
        totalEnergy - requiredEnergy;


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
        "totalEnergy",
        formatNumber(totalEnergy)
    );


    /*
     * Positive = energy remaining
     * Negative = energy shortage
     */
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


    /*
     * Original target progress.
     *
     * This is intentionally based only on the
     * original target energy requirement.
     */
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


    /*
     * Calculate how many original hits
     * the available energy can cover.
     */
    const possibleHits =
        Math.floor(
            totalEnergy / ENERGY_PER_HIT
        );


    setText(
        "hitResult",
        formatNumber(possibleHits) + " hits"
    );


    /*
     * Automatically keep Revitalize's
     * hit count synchronized with Target Hits
     * unless the user has manually changed it.
     */
    const revitalizeHits =
        document.getElementById("revitalizeHits");

    if (revitalizeHits &&
        document.activeElement !== revitalizeHits) {

        revitalizeHits.value =
            targetHits;
    }


    calculateRevitalize();
}


// ------------------------------------------------------------
// Revitalize calculator
// ------------------------------------------------------------

function calculateRevitalize() {

    const chanceInput =
        document.getElementById("revitalizeChance");

    const hitsInput =
        document.getElementById("revitalizeHits");


    if (!chanceInput || !hitsInput) {
        return;
    }


    let chance =
        parseFloat(chanceInput.value);

    if (!Number.isFinite(chance)) {
        chance = REVITALIZE_DEFAULT;
    }


    chance =
        clamp(
            Math.round(chance),
            REVITALIZE_MIN,
            REVITALIZE_MAX
        );


    /*
     * Keep the displayed input as a whole number.
     */
    chanceInput.value =
        chance;


    let hits =
        parseFloat(hitsInput.value);

    if (!Number.isFinite(hits) || hits < 0) {
        hits = 0;
    }


    /*
     * Revitalize bonus calculation:
     *
     * bonus hits =
     * original hits / (1 - chance)
     * minus original hits
     *
     * Example:
     *
     * 1,000 hits at 10%
     * = 1,000 / 0.90
     * = 1,111.11 total expected hits
     *
     * = 111.11 bonus hits
     */
    const totalExpectedHits =
        hits / (1 - (chance / 100));


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
        formatNumber(bonusHits, 2)
    );

    setText(
        "revitalizeTotalHits",
        formatNumber(totalExpectedHits, 2)
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
            clamp(progress, 0, 100) + "%";
    }
}


// ------------------------------------------------------------
// Event listeners
// ------------------------------------------------------------

function attachInputListeners() {

    const inputs =
        document.querySelectorAll(
            'input[type="number"]'
        );


    inputs.forEach(function (input) {

        input.addEventListener(
            "input",
            function () {

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
            function () {

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


    const newsletter =
        document.getElementById("newsletter");

    if (newsletter) {

        newsletter.addEventListener(
            "change",
            calculateEnergy
        );
    }


    const donatorStatus =
        document.getElementById("donatorStatus");

    if (donatorStatus) {

        donatorStatus.addEventListener(
            "change",
            function () {

                updateDonatorStatus();
                calculateEnergy();
            }
        );
    }
}


// ------------------------------------------------------------
// Initialize
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        attachInputListeners();

        updateDonatorStatus();

        calculateEnergy();

        calculateRevitalize();
    }
);
