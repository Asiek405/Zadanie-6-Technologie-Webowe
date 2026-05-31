import './style.css';
import { differenceInDays, differenceInWeeks, isToday, setYear, isBefore, startOfDay } from 'date-fns';

const form = document.getElementById('birthday-form');
const input = document.getElementById('birthday-input');
const dialog = document.getElementById('result-dialog');
const closeBtn = document.getElementById('close-dialog');
const dialogContent = document.getElementById('dialog-content');

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const birthDate = startOfDay(new Date(input.value));
    const today = startOfDay(new Date());

    const daysLived = differenceInDays(today, birthDate);
    let message = `<p class="mb-4">Od Twojej daty urodzenia minęło: <strong>${daysLived}</strong> dni.</p>`;

    let nextBirthday = setYear(birthDate, today.getFullYear());
    

    if (isBefore(nextBirthday, today) && !isToday(nextBirthday)) {
        nextBirthday = setYear(nextBirthday, today.getFullYear() + 1);
    }

    if (isToday(nextBirthday)) {

        message += `<p class="text-xl font-bold mt-2">Wszystkiego najlepszego!</p>`;
    } else {

        const weeksToBirthday = differenceInWeeks(nextBirthday, today);
        message += `<p>Do kolejnych urodzin pozostało tygodni: <strong>${weeksToBirthday}</strong>.</p>`;

        if (weeksToBirthday === 0) {
            message += `<p class="font-bold mt-2">Masz urodziny w tym tygodniu!</p>`;
        }
    }
    
    dialogContent.innerHTML = message;
    dialog.showModal();
});

closeBtn.addEventListener('click', () => {
    dialog.close();
});