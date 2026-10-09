export interface PathologyImage {
  lessonId: string;
  src: string;
  width: number;
  height: number;
  modality: string;
  alt: string;
  caption: string;
  findings: string[];
  limitation: string;
  author: string;
  sourceUrl: string;
  licence: string;
  licenceUrl: string;
  changes: string;
  readingUrl: string;
}

// Original published files are bundled locally, not generated or loaded from a third-party server.
// See public/pathology/README.md for acquisition URLs and provenance.
export const PATHOLOGY_IMAGES: PathologyImage[] = [
  {
    lessonId: 'pneumothorax', src: '/pathology/pneumothorax.jpg', width: 877, height: 807,
    modality: 'Chest radiograph',
    alt: 'Frontal chest radiograph showing a large left pneumothorax, on the right of the displayed image.',
    caption: 'Large left pneumothorax. The patient’s left is on the right of the displayed image, as identified in the source description.',
    findings: ['A broad peripheral lucent region on the patient’s left has no visible lung markings.', 'The left lung is displaced medially; the mediastinum is displaced towards the opposite side.'],
    limitation: 'No anatomical side marker is visible in this source image. Its accompanying clinical story is fictional; it is not reproduced here. This single image does not establish the patient’s clinical stability.',
    author: 'Clinical Cases; source crop by Doc James',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pneumothorax_CXR.jpg',
    licence: 'CC BY-SA 2.5', licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.5/',
    changes: 'No additional image edits by Bucky Lab.',
    readingUrl: 'https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_page4',
  },
  {
    lessonId: 'pleural-effusion', src: '/pathology/pleural-effusion.png', width: 1030, height: 871,
    modality: 'Upright chest radiograph',
    alt: 'Upright chest radiograph with a large left pleural effusion; a black circle is already present in the source image.',
    caption: 'Large left pleural effusion. The L marker identifies the patient’s left; the black circle is part of the published source image.',
    findings: ['There is extensive opacity in the lower left hemithorax, with a curved upper margin.', 'The left costophrenic angle and hemidiaphragm are obscured. Compare with the sharper right costophrenic angle.'],
    limitation: 'This is an annotated example of a large effusion, not an unmarked assessment image. Smaller or supine effusions may look different.',
    author: 'James Heilman, MD', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Effusionhalf.PNG',
    licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    changes: 'Unmodified published image, including its original circle.',
    readingUrl: 'https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_page4',
  },
  {
    lessonId: 'intracranial-haemorrhage', src: '/pathology/intracranial-haemorrhage.jpg', width: 1200, height: 1484,
    modality: 'Axial head CT',
    alt: 'Axial head CT showing intracerebral and intraventricular haemorrhage.',
    caption: 'Intracerebral haemorrhage with intraventricular extension, as described by the image source.',
    findings: ['Hyperattenuating blood is visible within the brain and ventricular system.', 'The bright ventricular contents illustrate extension of haemorrhage into the cerebrospinal fluid spaces.'],
    limitation: 'This is one published CT slice, not a scrollable study. It does not illustrate every type of intracranial haemorrhage or replace review of the complete examination.',
    author: 'Glitzy queen00',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Intracerebral_hemorrage_(CT_scan).jpg',
    licence: 'Public domain',
    licenceUrl: 'https://commons.wikimedia.org/wiki/File:Intracerebral_hemorrage_(CT_scan).jpg#Summary',
    changes: 'No image edits by Bucky Lab.',
    readingUrl: 'https://www.radiologymasterclass.co.uk/tutorials/ct/ct_acute_brain/ct_brain_cerebral_haemorrhage',
  },
];

export const pathologyImage = (lessonId: string) => PATHOLOGY_IMAGES.find(image => image.lessonId === lessonId);
