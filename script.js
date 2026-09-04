const ENERGY_PER_HIT = 25;

const XANAX_ENERGY = 250;
const LSD_ENERGY = 50;

const NEWSLETTER_ENERGY = 250;

const DONATOR_ENERGY_PER_HOUR = 30;
const NON_DONATOR_ENERGY_PER_HOUR = 5;

const POINT_REFILL_ENERGY = 100;
const HOTEL_REFILL_ENERGY = 150;


// ------------------------------------------------------------
// Revitalize settings
// ------------------------------------------------------------

const REVITALIZE_MIN = 10;
const REVITALIZE_MAX = 24;
const REVITALIZE_DEFAULT = 10;


// ------------------------------------------------------------
// Utility
// ------------------------------------------------------------

function numberValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = Number(element.value);

    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }

    return value;
}


function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function formatNumber(value, decimals = 0) {

    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

}


// ------------------------------------------------------------
// Energy Cans
// ------------------------------------------------------------

const ENERGY_CANS = [

    {
        input: "canGooseJuice",
        output: "canGooseJuiceEnergy",
        energy: 5
    },

    {
        input: "canDampValley",
        output: "canDampValleyEnergy",
        energy: 10
    },

    {
        input: "canCrocozade",
        output: "canCrocozadeEnergy",
        energy: 15
    },

    {
        input: "canMunster",
        output: "canMunsterEnergy",
        energy: 20
    },

    {
        input: "canSantaShooters",
        output: "canSantaShootersEnergy",
        energy: 20
    },

    {
        input: "canRedCow",
        output: "canRedCowEnergy",
        energy: 25
    },

    {
        input: "canRockstarRudolph",
        output: "canRockstarRudolphEnergy",
        energy: 25
    },

    {
        input: "canTaurineElite",
        output: "canTaurineEliteEnergy",
        energy: 30
    },

    {
        input: "canXMass",
        output: "canXMassEnergy",
        energy: 30
    }

];


function calculateCanEnergy() {

    let total = 0;

    ENERGY_CANS.forEach(can => {

        const quantity = numberValue(can.input);

        const energy =
            quantity * can.energy;

        total += energy;

        setText(
            can.output,
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
// Revitalize Weapon Bonus Hits
// ------------------------------------------------------------

function calculateRevitalize() {

    let chance =
        Math.round(
            numberValue("revitalizeChance")
        );

    const hits =
        numberValue("revitalizeHits");


    if (chance < REVITALIZE_MIN) {
        chance = REVITALIZE_MIN;
    }


    if (chance > REVITALIZE_MAX) {
        chance = REVITALIZE_MAX;
    }


    const chanceInput =
        document.getElementById(
            "revitalizeChance"
        );


    if (chanceInput) {
        chanceInput.value = chance;
    }


    const probability =
        chance / 100;


    let expectedTotalHits = 0;
    let expectedBonusHits = 0;


    if (probability < 1) {

        expectedTotalHits =
            hits / (1 - probability);

        expectedBonusHits =
            expectedTotalHits - hits;

    }


    setText(
        "revitalizeChanceResult",
        `${chance}%`
    );


    setText(
        "revitalizeHitsResult",
        formatNumber(hits)
    );


    setText(
        "revitalizeBonusHits",
        formatNumber(expectedBonusHits, 2)
    );


    setText(
        "revitalizeTotalHits",
        formatNumber(expectedTotalHits, 2)
    );


    setText(
        "revitalizeProgressText",
        `${chance}%`
    );


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
            `${Math.max(0, Math.min(100, progress))}%`;

    }

}


// ------------------------------------------------------------
// Refills
// ------------------------------------------------------------

function calculateRefills() {

    const inactivityHours =
        numberValue("inactivityHours");


    const donatorStatusElement =
        document.getElementById(
            "donatorStatus"
        );


    const donatorStatus =
        donatorStatusElement
            ? donatorStatusElement.checked
            : false;


    const pointRefills =
        numberValue("pointRefills");


    const hotelRefills =
        numberValue("hotelRefills");


    const refillRate =
        donatorStatus
            ? DONATOR_ENERGY_PER_HOUR
            : NON_DONATOR_ENERGY_PER_HOUR;


    const inactivityEnergy =
        inactivityHours *
        refillRate;


    const pointEnergy =
        pointRefills *
        POINT_REFILL_ENERGY;


    const hotelEnergy =
        hotelRefills *
        HOTEL_REFILL_ENERGY;


    const total =
        inactivityEnergy +
        pointEnergy +
        hotelEnergy;


    setText(
        "refillRate",
        `${formatNumber(refillRate)} energy/hour`
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


    const statusText =
        document.getElementById(
            "donatorStatusText"
        );


    if (statusText) {

        statusText.textContent =
            donatorStatus
                ? "ON"
                : "OFF";


        statusText.classList.toggle(
            "on",
            donatorStatus
        );

    }


    return total;
}


// ------------------------------------------------------------
// Main Energy Calculator
// ------------------------------------------------------------

function calculateEnergy() {

    const targetHits =
        numberValue("targetHits");


    const currentEnergy =
        numberValue("currentEnergy");


    const xanaxQty =
        numberValue("xanaxQty");


    const lsdQty =
        numberValue("lsdQty");


    const newsletterElement =
        document.getElementById(
            "newsletter"
        );


    const newsletter =
        newsletterElement
            ? newsletterElement.checked
            : false;


    const requiredEnergy =
        targetHits *
        ENERGY_PER_HIT;


    const xanaxEnergy =
        xanaxQty *
        XANAX_ENERGY;


    const lsdEnergy =
        lsdQty *
        LSD_ENERGY;


    const newsletterEnergy =
        newsletter
            ? NEWSLETTER_ENERGY
            : 0;


    const canEnergy =
        calculateCanEnergy();


    const refillEnergy =
        calculateRefills();


    const totalEnergy =
        currentEnergy +
        xanaxEnergy +
        lsdEnergy +
        newsletterEnergy +
        canEnergy +
        refillEnergy;


    const energyDifference =
        totalEnergy -
        requiredEnergy;


    const possibleHits =
        Math.floor(
            totalEnergy /
            ENERGY_PER_HIT
        );


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


    setText(
        "energyDifference",
        energyDifference >= 0
            ? `+${formatNumber(energyDifference)}`
            : formatNumber(energyDifference)
    );


    setText(
        "hitResult",
        `${formatNumber(possibleHits)} hits`
    );


    let progress = 0;


    if (requiredEnergy > 0) {

        progress =
            (
                totalEnergy /
                requiredEnergy
            ) * 100;

    }


    progress =
        Math.min(100, progress);


    setText(
        "energyProgressText",
        `${progress.toFixed(1)}%`
    );


    const progressBar =
        document.getElementById(
            "energyProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }

}


// ------------------------------------------------------------
// Event Handlers
// ------------------------------------------------------------

function setupEventHandlers() {

    const inputIds = [

        "targetHits",
        "currentEnergy",
        "xanaxQty",
        "lsdQty",
        "newsletter",

        "inactivityHours",
        "donatorStatus",
        "pointRefills",
        "hotelRefills",

        "revitalizeChance",
        "revitalizeHits"

    ];


    ENERGY_CANS.forEach(can => {

        inputIds.push(
            can.input
        );

    });


    inputIds.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "input",
            () => {

                calculateEnergy();
                calculateRevitalize();

            }
        );


        element.addEventListener(
            "change",
            () => {

                calculateEnergy();
                calculateRevitalize();

            }
        );

    });

}


// ------------------------------------------------------------
// Initial Calculation
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupEventHandlers();

        calculateEnergy();

        calculateRevitalize();

    }
);
