// Function to convert blendshape data to CSV format for Unreal Engine

import store, { keyFrames } from "./Store";



const fps = 60; // framess per second (60 FPS)
let hours = 0;
let minutes = 0;
let seconds = 0;
let frames = 0;
function startTimecode() {

    hours = 0;
    minutes = 0;
    seconds = 0;
    frames = 0;

    store.recording = true;

}
function formatTimecode(hours, minutes, seconds, frames) {
    return (
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0') + ':' +
        String(frames).padStart(2, '0')
    );
}


export function getTime() {
    frames++;

    // If framees reach 60, reset and increment seconds
    if (frames >= fps) {
        frames = 0;
        seconds++;
    }

    // If seconds reach 60, reset and increment minutes
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    // If minutes reach 60, reset and increment hours
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }

    // Log or display the timecode
    return formatTimecode(hours, minutes, seconds, frames);
}

// Start the timecode counter



export function recordBlendshapesToCSV() {


    if (store.recording) {
        store.recording = undefined;

        downloadCSV(jsonArrayToCSV(keyFrames), 'BlendshapeData.csv');
        keyFrames.length = 0;

        return;
    }


    startTimecode();



}



function jsonArrayToCSV(jsonArray) {
    // Check if the input is a valid array with at least one object
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        console.error('Invalid JSON array');
        return null;
    }

    // Extract the keys (headers) from the first object in the array
    const keys = Object.keys(jsonArray[0]);

    // Create the CSV header row
    const header = keys.join(',');

    // Map through each object in the array and create a CSV row
    const rows = jsonArray.map(obj => {
        return keys.map(key => {
            // Handle missing keys or undefined values
            const value = obj[key] !== undefined ? obj[key] : '';
            // Escape values that may contain commas, double quotes, or newlines
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;  // Escape double quotes
            }
            return value;
        }).join(',');  // Join values for the row
    });

    // Combine the header and rows into a single CSV string
    const csvContent = [header, ...rows].join('\n');

    return csvContent;
}
// Utility function to trigger CSV file download in the browser
export function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}