import type {PathologyLesson} from './imaging-learning-model';
import type {PathologyImage} from './pathology-images';

export const ADDITIONAL_PATHOLOGY_LESSONS: PathologyLesson[] = [
  {
    "id": "consolidation",
    "title": "Lobar consolidation (pneumonia)",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Chest"
    ],
    "appearance": [
      "Airspace opacity, sometimes with air bronchograms",
      "Silhouette loss can help localise a lobe"
    ],
    "lookFor": [
      "Compare lung zones and adjacent heart and diaphragm borders"
    ],
    "bestViews": [
      "PA chest; lateral view can aid localisation when indicated"
    ],
    "pitfalls": [
      "Consolidation is a pattern, not proof of bacterial infection."
    ],
    "differentials": [
      "Oedema",
      "Haemorrhage",
      "Atelectasis"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start",
      "https://commons.wikimedia.org/wiki/File:X-ray_of_lobar_pneumonia.jpg"
    ]
  },
  {
    "id": "pulmonary-oedema",
    "title": "Pulmonary oedema",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Chest"
    ],
    "appearance": [
      "Bilateral airspace opacity",
      "Interstitial oedema may produce septal lines"
    ],
    "lookFor": [
      "Review distribution, heart size and pleural spaces"
    ],
    "bestViews": [
      "Chest radiograph; compare with previous imaging"
    ],
    "pitfalls": [
      "This example is aspiration-related, not evidence of cardiogenic heart failure."
    ],
    "differentials": [
      "Infection",
      "Alveolar haemorrhage",
      "Acute respiratory distress syndrome"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start",
      "https://commons.wikimedia.org/wiki/File:Salt_water_aspiration_syndrome_chest_x-ray,_before_treatment.png"
    ]
  },
  {
    "id": "cardiomegaly",
    "title": "Cardiomegaly",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Chest"
    ],
    "appearance": [
      "Increased cardiac silhouette on an adequately inspired PA view"
    ],
    "lookFor": [
      "Check projection and inspiration before estimating heart size"
    ],
    "bestViews": [
      "PA erect chest is preferable for assessing cardiac size"
    ],
    "pitfalls": [
      "AP magnification and poor inspiration exaggerate apparent heart size; a radiograph cannot distinguish chamber enlargement from pericardial fluid reliably."
    ],
    "differentials": [
      "AP magnification",
      "Pericardial effusion",
      "Poor inspiration"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start",
      "https://commons.wikimedia.org/wiki/File:Cardiomegally.PNG"
    ]
  },
  {
    "id": "atelectasis",
    "title": "Atelectasis (lung collapse)",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Chest"
    ],
    "appearance": [
      "Increased opacity with volume loss",
      "Displaced fissures, hilum or mediastinum"
    ],
    "lookFor": [
      "Look for structural displacement towards the abnormality"
    ],
    "bestViews": [
      "Frontal chest; lateral view or CT may clarify extent and cause"
    ],
    "pitfalls": [
      "An opaque hemithorax is not always an effusion; inspect the direction of displacement."
    ],
    "differentials": [
      "Pleural effusion",
      "Consolidation",
      "Previous pneumonectomy"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start",
      "https://commons.wikimedia.org/wiki/File:Atelectasia1.jpg"
    ]
  },
  {
    "id": "tuberculosis",
    "title": "Pulmonary tuberculosis",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Chest"
    ],
    "appearance": [
      "Upper-zone opacity and cavitation may occur",
      "Appearances vary with disease stage and immune status"
    ],
    "lookFor": [
      "Review apices and compare with prior images"
    ],
    "bestViews": [
      "Chest radiograph; further imaging depends on clinical assessment"
    ],
    "pitfalls": [
      "Radiography alone cannot confirm tuberculosis or determine infectiousness. Original arrows and arrowheads are retained."
    ],
    "differentials": [
      "Other cavitating infection",
      "Cavitating malignancy",
      "Fungal disease"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start",
      "https://commons.wikimedia.org/wiki/File:Tuberculosis-x-ray-1.jpg"
    ]
  },
  {
    "id": "small-bowel-obstruction",
    "title": "Small bowel obstruction",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Abdomen"
    ],
    "appearance": [
      "Dilated central small bowel loops",
      "Valvulae conniventes may cross the full lumen"
    ],
    "lookFor": [
      "Assess bowel calibre, fold pattern and distal gas"
    ],
    "bestViews": [
      "Abdominal radiography in selected patients; CT assesses the transition point, cause and complications"
    ],
    "pitfalls": [
      "Air–fluid levels are not specific. A normal radiograph cannot exclude obstruction or ischaemia."
    ],
    "differentials": [
      "Ileus",
      "Large bowel obstruction with small bowel dilatation"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction",
      "https://commons.wikimedia.org/wiki/File:Upright_X-ray_demonstrating_small_bowel_obstruction.jpg"
    ]
  },
  {
    "id": "pneumoperitoneum",
    "title": "Pneumoperitoneum",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Abdomen"
    ],
    "appearance": [
      "Extra-luminal gas",
      "Gas beneath the diaphragm on an erect image"
    ],
    "lookFor": [
      "Identify gas outside rather than within bowel"
    ],
    "bestViews": [
      "Erect chest or decubitus radiograph; CT is more sensitive when clinically indicated"
    ],
    "pitfalls": [
      "Postoperative gas can have the same appearance. A negative radiograph does not exclude perforation."
    ],
    "differentials": [
      "Postoperative free gas",
      "Interposed bowel (Chilaiditi sign)"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction",
      "https://commons.wikimedia.org/wiki/File:Pneumoperitoneum_bei_Sigmaperforation_76M_-_CR_LSL_-_001.jpg"
    ]
  },
  {
    "id": "sigmoid-volvulus",
    "title": "Sigmoid volvulus",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Abdomen"
    ],
    "appearance": [
      "Large inverted U or coffee-bean configuration",
      "Reduced distal gas may occur"
    ],
    "lookFor": [
      "Trace the dilated loop and its central wall line"
    ],
    "bestViews": [
      "Abdominal radiograph; further assessment is guided by the acute surgical team"
    ],
    "pitfalls": [
      "This is a child’s example, not a typical adult case. The radiograph cannot establish bowel viability."
    ],
    "differentials": [
      "Caecal volvulus",
      "Other large bowel obstruction",
      "Pseudo-obstruction"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction",
      "https://commons.wikimedia.org/wiki/File:Sigmoidvolvulus.jpg"
    ]
  },
  {
    "id": "clavicle-fracture",
    "title": "Clavicle fracture",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Upper limb"
    ],
    "appearance": [
      "Cortical disruption",
      "Displacement, angulation or shortening"
    ],
    "lookFor": [
      "Follow the entire clavicle and assess adjacent joints"
    ],
    "bestViews": [
      "Clavicle AP and additional angled view according to local protocol"
    ],
    "pitfalls": [
      "This source is a photograph of a film; perspective and resolution limit measurements."
    ],
    "differentials": [
      "Old healed fracture",
      "Developmental variant"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start",
      "https://commons.wikimedia.org/wiki/File:Clavicle_fracture.jpg"
    ]
  },
  {
    "id": "distal-radius-fracture",
    "title": "Distal radius fracture (Colles pattern)",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Upper limb"
    ],
    "appearance": [
      "Distal radial metaphyseal fracture",
      "Dorsal angulation defines a typical Colles pattern"
    ],
    "lookFor": [
      "Assess tilt, radial length, joint extension and associated ulnar injury"
    ],
    "bestViews": [
      "PA and lateral wrist views"
    ],
    "pitfalls": [
      "Circles were present in the source. Assess all views; a single projection can underestimate displacement."
    ],
    "differentials": [
      "Smith fracture",
      "Barton fracture",
      "Other distal radius fracture"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start",
      "https://commons.wikimedia.org/wiki/File:Colles_fracture.JPG"
    ]
  },
  {
    "id": "scaphoid-fracture",
    "title": "Scaphoid fracture",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Upper limb"
    ],
    "appearance": [
      "Subtle lucency or cortical break across the scaphoid"
    ],
    "lookFor": [
      "Trace the scaphoid cortex on all available views"
    ],
    "bestViews": [
      "Dedicated scaphoid views; MRI may be required for clinically suspected occult fracture"
    ],
    "pitfalls": [
      "A normal initial X-ray does not exclude scaphoid fracture. The arrow is part of the source image."
    ],
    "differentials": [
      "Vascular channel",
      "Projectional overlap"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start",
      "https://commons.wikimedia.org/wiki/File:X-ray_of_scaphoid_fracture.png"
    ]
  },
  {
    "id": "shoulder-dislocation",
    "title": "Anterior shoulder dislocation",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Upper limb"
    ],
    "appearance": [
      "Loss of glenohumeral congruence",
      "Anterior dislocations commonly lie inferomedial to the glenoid"
    ],
    "lookFor": [
      "Assess head position and associated fracture"
    ],
    "bestViews": [
      "AP plus an orthogonal view appropriate to pain and local trauma protocol"
    ],
    "pitfalls": [
      "This is a low-resolution historical example. One frontal image is insufficient to fully assess direction and associated injury."
    ],
    "differentials": [
      "Posterior dislocation",
      "Inferior dislocation",
      "Fracture-dislocation"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start",
      "https://commons.wikimedia.org/wiki/File:Shoulder_dislocation.jpg"
    ]
  },
  {
    "id": "bimalleolar-fracture",
    "title": "Bimalleolar ankle fracture",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Fractures of both medial and lateral malleoli"
    ],
    "lookFor": [
      "Assess mortise congruence, talar displacement and the posterior malleolus"
    ],
    "bestViews": [
      "Ankle AP/mortise and lateral views"
    ],
    "pitfalls": [
      "A frontal view cannot exclude a posterior malleolar component; this published image has limited resolution."
    ],
    "differentials": [
      "Trimalleolar fracture",
      "Isolated malleolar fracture with ligament injury"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:X-ray_of_bimalleolar_fracture.jpg"
    ]
  },
  {
    "id": "knee-osteoarthritis",
    "title": "Knee osteoarthritis",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Non-uniform joint-space loss",
      "Osteophytes and subchondral sclerosis"
    ],
    "lookFor": [
      "Compare compartments and inspect alignment"
    ],
    "bestViews": [
      "Weight-bearing knee views when appropriate; lateral and patellofemoral views according to symptoms"
    ],
    "pitfalls": [
      "Radiographic severity does not reliably predict symptom severity."
    ],
    "differentials": [
      "Inflammatory arthritis",
      "Post-traumatic arthritis"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:Osteoarthritis_on_X-ray.jpg"
    ]
  },
  {
    "id": "osteomyelitis",
    "title": "Osteomyelitis",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Bone destruction and periosteal reaction may develop",
      "Chronic infection may produce sclerosis and sequestra"
    ],
    "lookFor": [
      "Review cortex, medulla, periosteum and adjacent soft tissues"
    ],
    "bestViews": [
      "Radiographs provide a baseline; MRI may be needed for early disease or extent"
    ],
    "pitfalls": [
      "Early osteomyelitis may have a normal radiograph. Imaging must be interpreted with clinical and laboratory findings."
    ],
    "differentials": [
      "Bone tumour",
      "Healing trauma",
      "Other periosteal reaction"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:Osteomyelitis_of_Tibia_in_Child.jpg"
    ]
  },
  {
    "id": "scoliosis",
    "title": "Scoliosis",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Spine"
    ],
    "appearance": [
      "Coronal curvature with vertebral rotation"
    ],
    "lookFor": [
      "Assess curve pattern, vertebral morphology and pelvic alignment"
    ],
    "bestViews": [
      "Standing whole-spine radiographs when clinically indicated"
    ],
    "pitfalls": [
      "Source angles are illustrative; do not remeasure this small image or use it to make treatment decisions."
    ],
    "differentials": [
      "Postural curvature",
      "Congenital vertebral anomaly"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:X-ray_of_scoliosis.png"
    ]
  },
  {
    "id": "hip-fracture",
    "title": "Femoral neck fracture",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Cortical or trabecular interruption at the femoral neck",
      "Displacement or impaction may be present"
    ],
    "lookFor": [
      "Check femoral neck continuity and alignment"
    ],
    "bestViews": [
      "AP pelvis and lateral hip according to local protocol; MRI for suspected occult fracture when appropriate"
    ],
    "pitfalls": [
      "A normal initial radiograph does not exclude hip fracture. Do not force painful positioning."
    ],
    "differentials": [
      "Intertrochanteric fracture",
      "Occult fracture",
      "Pathological fracture"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:Cdm_hip_fracture_343.jpg"
    ]
  },
  {
    "id": "vertebral-compression-fracture",
    "title": "Vertebral compression fracture",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Spine"
    ],
    "appearance": [
      "Loss of vertebral body height",
      "Anterior wedging or endplate depression"
    ],
    "lookFor": [
      "Compare heights, endplates and posterior alignment"
    ],
    "bestViews": [
      "Lateral and AP spine; CT or MRI may be needed depending on clinical context"
    ],
    "pitfalls": [
      "A radiograph cannot reliably date the fracture or exclude posterior wall involvement."
    ],
    "differentials": [
      "Osteoporotic fracture",
      "Malignant collapse",
      "Developmental wedging"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:Compressionfracture.jpg"
    ]
  },
  {
    "id": "rickets",
    "title": "Rickets",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Metaphyseal cupping, fraying and splaying",
      "Widened growth plates may occur"
    ],
    "lookFor": [
      "Inspect growth plates and metaphyses for abnormal contour"
    ],
    "bestViews": [
      "Targeted radiographs according to paediatric assessment"
    ],
    "pitfalls": [
      "Radiographic findings require biochemical and clinical correlation; they do not establish the cause. This small source image is suitable for an overview of deformity, not detailed metaphyseal assessment."
    ],
    "differentials": [
      "Metaphyseal dysplasia",
      "Other metabolic bone disease"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:XrayRicketsLegssmall.jpg"
    ]
  },
  {
    "id": "jones-fracture",
    "title": "Jones fracture (fifth metatarsal)",
    "modalities": [
      "X-ray"
    ],
    "regions": [
      "Lower limb"
    ],
    "appearance": [
      "Fracture at the proximal fifth metatarsal metaphyseal–diaphyseal junction"
    ],
    "lookFor": [
      "Locate the fracture relative to the tuberosity and fourth–fifth intermetatarsal articulation"
    ],
    "bestViews": [
      "Foot DP, oblique and lateral views"
    ],
    "pitfalls": [
      "Distinguish a Jones fracture from a tuberosity avulsion and a longitudinal unfused apophysis."
    ],
    "differentials": [
      "Tuberosity avulsion",
      "Stress fracture",
      "Normal apophysis"
    ],
    "references": [
      "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone",
      "https://commons.wikimedia.org/wiki/File:Jonesfracture.jpg"
    ]
  }
];

export const ADDITIONAL_PATHOLOGY_IMAGES: PathologyImage[] = [
  {
    "lessonId": "consolidation",
    "src": "/pathology/consolidation.jpg",
    "width": 3027,
    "height": 2407,
    "author": "Mikael Häggström, MD",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:X-ray_of_lobar_pneumonia.jpg",
    "licence": "CC0",
    "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "modality": "X-ray · Chest",
    "alt": "Right middle lobe pneumonia, as described in the published source.",
    "caption": "Right middle lobe pneumonia, as described in the published source.",
    "findings": [
      "Focal airspace opacity is visible in the right lower zone.",
      "The source localises the disease to the right middle lobe."
    ],
    "limitation": "Consolidation is a pattern, not proof of bacterial infection.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start"
  },
  {
    "lessonId": "pulmonary-oedema",
    "src": "/pathology/pulmonary-oedema.png",
    "width": 480,
    "height": 480,
    "author": "Dr. Terence McManus",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Salt_water_aspiration_syndrome_chest_x-ray,_before_treatment.png",
    "licence": "CC BY-SA 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "modality": "X-ray · Chest",
    "alt": "Pulmonary oedema following salt-water aspiration, before treatment.",
    "caption": "Pulmonary oedema following salt-water aspiration, before treatment.",
    "findings": [
      "Bilateral patchy airspace opacities involve the mid and lower lung zones."
    ],
    "limitation": "This example is aspiration-related, not evidence of cardiogenic heart failure.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start"
  },
  {
    "lessonId": "cardiomegaly",
    "src": "/pathology/cardiomegaly.png",
    "width": 1060,
    "height": 960,
    "author": "James Heilman, MD",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cardiomegally.PNG",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "modality": "X-ray · Chest",
    "alt": "Enlarged cardiac silhouette with a pacemaker.",
    "caption": "Enlarged cardiac silhouette with a pacemaker.",
    "findings": [
      "The cardiac silhouette occupies a large proportion of the thoracic width.",
      "A pacemaker and leads are present."
    ],
    "limitation": "AP magnification and poor inspiration exaggerate apparent heart size; a radiograph cannot distinguish chamber enlargement from pericardial fluid reliably.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start"
  },
  {
    "lessonId": "atelectasis",
    "src": "/pathology/atelectasis.jpg",
    "width": 714,
    "height": 586,
    "author": "The original uploader was Pabloes at Spanish Wikipedia.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Atelectasia1.jpg",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "modality": "X-ray · Chest",
    "alt": "Right lung atelectasis in the source case.",
    "caption": "Right lung atelectasis in the source case.",
    "findings": [
      "Marked right-sided opacity accompanies loss of right lung volume.",
      "The mediastinum is drawn towards the opaque side."
    ],
    "limitation": "An opaque hemithorax is not always an effusion; inspect the direction of displacement.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start"
  },
  {
    "lessonId": "tuberculosis",
    "src": "/pathology/tuberculosis.jpg",
    "width": 590,
    "height": 542,
    "author": "CDC / public health image archive; individual author unrecorded",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tuberculosis-x-ray-1.jpg",
    "licence": "Public domain",
    "licenceUrl": "https://commons.wikimedia.org/wiki/File:Tuberculosis-x-ray-1.jpg",
    "modality": "X-ray · Chest",
    "alt": "Annotated AP chest radiograph of advanced pulmonary tuberculosis.",
    "caption": "Annotated AP chest radiograph of advanced pulmonary tuberculosis.",
    "findings": [
      "The source arrows identify right apical cavitation.",
      "Arrowheads mark bilateral pulmonary infiltrates."
    ],
    "limitation": "Radiography alone cannot confirm tuberculosis or determine infectiousness. Original arrows and arrowheads are retained.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/chest/chest_pathology/chest_pathology_start"
  },
  {
    "lessonId": "small-bowel-obstruction",
    "src": "/pathology/small-bowel-obstruction.jpg",
    "width": 2285,
    "height": 2696,
    "author": "James Heilman, MD",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Upright_X-ray_demonstrating_small_bowel_obstruction.jpg",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "modality": "X-ray · Abdomen",
    "alt": "Upright radiograph illustrating small bowel obstruction.",
    "caption": "Upright radiograph illustrating small bowel obstruction.",
    "findings": [
      "Multiple gas-filled bowel loops show air–fluid levels."
    ],
    "limitation": "Air–fluid levels are not specific. A normal radiograph cannot exclude obstruction or ischaemia.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction"
  },
  {
    "lessonId": "pneumoperitoneum",
    "src": "/pathology/pneumoperitoneum.jpg",
    "width": 1262,
    "height": 1094,
    "author": "Hellerhoff",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pneumoperitoneum_bei_Sigmaperforation_76M_-_CR_LSL_-_001.jpg",
    "licence": "CC BY-SA 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "modality": "X-ray · Abdomen",
    "alt": "Decubitus radiograph showing free intraperitoneal gas following sigmoid perforation.",
    "caption": "Decubitus radiograph showing free intraperitoneal gas following sigmoid perforation.",
    "findings": [
      "A large extra-luminal gas collection lies along the non-dependent abdominal wall.",
      "Gas outlines both sides of some bowel walls (Rigler sign)."
    ],
    "limitation": "Postoperative gas can have the same appearance. A negative radiograph does not exclude perforation.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction"
  },
  {
    "lessonId": "sigmoid-volvulus",
    "src": "/pathology/sigmoid-volvulus.jpg",
    "width": 510,
    "height": 624,
    "author": "Mont4nha",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sigmoidvolvulus.jpg",
    "licence": "CC0",
    "licenceUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "modality": "X-ray · Abdomen",
    "alt": "Published paediatric example of sigmoid volvulus.",
    "caption": "Published paediatric example of sigmoid volvulus.",
    "findings": [
      "A markedly dilated loop of bowel dominates the abdomen, with a central apposed-wall line."
    ],
    "limitation": "This is a child’s example, not a typical adult case. The radiograph cannot establish bowel viability.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/abdo/abdomen_x-ray_abnormalities/pathology_introduction"
  },
  {
    "lessonId": "clavicle-fracture",
    "src": "/pathology/clavicle-fracture.jpg",
    "width": 1530,
    "height": 1020,
    "author": "mexican 2000",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Clavicle_fracture.jpg",
    "licence": "CC BY-SA 2.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "modality": "X-ray · Upper limb",
    "alt": "Photograph of a radiograph showing a right clavicular fracture.",
    "caption": "Photograph of a radiograph showing a right clavicular fracture.",
    "findings": [
      "There is a break in the clavicular shaft with displacement of the fragments."
    ],
    "limitation": "This source is a photograph of a film; perspective and resolution limit measurements.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start"
  },
  {
    "lessonId": "distal-radius-fracture",
    "src": "/pathology/distal-radius-fracture.jpg",
    "width": 3465,
    "height": 2860,
    "author": "Ashish j29",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Colles_fracture.JPG",
    "licence": "CC BY 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/3.0",
    "modality": "X-ray · Upper limb",
    "alt": "Multiple wrist views with source circles marking a distal radial fracture.",
    "caption": "Multiple wrist views with source circles marking a distal radial fracture.",
    "findings": [
      "The circled distal radius has cortical disruption.",
      "The lateral view demonstrates angulation of the distal fragment."
    ],
    "limitation": "Circles were present in the source. Assess all views; a single projection can underestimate displacement.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start"
  },
  {
    "lessonId": "scaphoid-fracture",
    "src": "/pathology/scaphoid-fracture.png",
    "width": 1027,
    "height": 1374,
    "author": "Gilo1969",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:X-ray_of_scaphoid_fracture.png",
    "licence": "CC BY 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/3.0",
    "modality": "X-ray · Upper limb",
    "alt": "Scaphoid waist fracture indicated by the source arrow.",
    "caption": "Scaphoid waist fracture indicated by the source arrow.",
    "findings": [
      "A lucent line crosses the scaphoid waist at the arrow."
    ],
    "limitation": "A normal initial X-ray does not exclude scaphoid fracture. The arrow is part of the source image.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start"
  },
  {
    "lessonId": "shoulder-dislocation",
    "src": "/pathology/shoulder-dislocation.jpg",
    "width": 206,
    "height": 245,
    "author": "Drfrancescsoler",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shoulder_dislocation.jpg",
    "licence": "CC BY-SA 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "modality": "X-ray · Upper limb",
    "alt": "Frontal shoulder radiograph showing anterior dislocation, as identified in the source.",
    "caption": "Frontal shoulder radiograph showing anterior dislocation, as identified in the source.",
    "findings": [
      "The humeral head is displaced from its normal relationship with the glenoid."
    ],
    "limitation": "This is a low-resolution historical example. One frontal image is insufficient to fully assess direction and associated injury.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/trauma/trauma_x-ray_start"
  },
  {
    "lessonId": "bimalleolar-fracture",
    "src": "/pathology/bimalleolar-fracture.jpg",
    "width": 325,
    "height": 405,
    "author": "Article authors: Nazzar Tellisi, I S Abdulkareem, P G Giannoudis",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:X-ray_of_bimalleolar_fracture.jpg",
    "licence": "CC BY 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
    "modality": "X-ray · Lower limb",
    "alt": "Frontal ankle radiograph of a bimalleolar fracture.",
    "caption": "Frontal ankle radiograph of a bimalleolar fracture.",
    "findings": [
      "Fractures involve the medial malleolus and distal fibula.",
      "The ankle joint alignment is disrupted."
    ],
    "limitation": "A frontal view cannot exclude a posterior malleolar component; this published image has limited resolution.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "knee-osteoarthritis",
    "src": "/pathology/knee-osteoarthritis.jpg",
    "width": 2133,
    "height": 2652,
    "author": "James Heilman, MD",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Osteoarthritis_on_X-ray.jpg",
    "licence": "CC BY-SA 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "modality": "X-ray · Lower limb",
    "alt": "Knee radiograph showing osteoarthritic change.",
    "caption": "Knee radiograph showing osteoarthritic change.",
    "findings": [
      "There is joint-space narrowing with marginal osteophytes.",
      "Subchondral bone appears sclerotic."
    ],
    "limitation": "Radiographic severity does not reliably predict symptom severity.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "osteomyelitis",
    "src": "/pathology/osteomyelitis.jpg",
    "width": 1200,
    "height": 1600,
    "author": "sarindam7",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Osteomyelitis_of_Tibia_in_Child.jpg",
    "licence": "CC BY-SA 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "modality": "X-ray · Lower limb",
    "alt": "Published tibial osteomyelitis example in a child.",
    "caption": "Published tibial osteomyelitis example in a child.",
    "findings": [
      "The tibia has irregular lucent areas and abnormal surrounding bone formation."
    ],
    "limitation": "Early osteomyelitis may have a normal radiograph. Imaging must be interpreted with clinical and laboratory findings.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "scoliosis",
    "src": "/pathology/scoliosis.png",
    "width": 221,
    "height": 669,
    "author": "HR Weiss, S Seibel, A Kleban",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:X-ray_of_scoliosis.png",
    "licence": "CC BY 4.0",
    "licenceUrl": "https://creativecommons.org/licenses/by/4.0",
    "modality": "X-ray · Spine",
    "alt": "Spinal radiograph with source Cobb-angle annotations.",
    "caption": "Spinal radiograph with source Cobb-angle annotations.",
    "findings": [
      "The spine shows lateral curvature.",
      "The original source includes angle measurements."
    ],
    "limitation": "Source angles are illustrative; do not remeasure this small image or use it to make treatment decisions.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "hip-fracture",
    "src": "/pathology/hip-fracture.jpg",
    "width": 2367,
    "height": 1793,
    "author": "Booyabazooka",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cdm_hip_fracture_343.jpg",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "modality": "X-ray · Lower limb",
    "alt": "Hip radiograph showing a proximal femoral fracture. The blue arrow is part of the source image.",
    "caption": "Hip radiograph showing a proximal femoral fracture. The blue arrow is part of the source image.",
    "findings": [
      "There is a break through the proximal femur with altered alignment."
    ],
    "limitation": "A normal initial radiograph does not exclude hip fracture. Do not force painful positioning.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "vertebral-compression-fracture",
    "src": "/pathology/vertebral-compression-fracture.jpg",
    "width": 924,
    "height": 1980,
    "author": "Lucien Monfils",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Compressionfracture.jpg",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "modality": "X-ray · Spine",
    "alt": "Lumbar radiograph showing an L3 compression fracture, as identified in the source.",
    "caption": "Lumbar radiograph showing an L3 compression fracture, as identified in the source.",
    "findings": [
      "The affected vertebral body has reduced height compared with adjacent levels."
    ],
    "limitation": "A radiograph cannot reliably date the fracture or exclude posterior wall involvement.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "rickets",
    "src": "/pathology/rickets.jpg",
    "width": 256,
    "height": 406,
    "author": "The original uploader was Mrich at English Wikipedia.",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:XrayRicketsLegssmall.jpg",
    "licence": "CC BY-SA 1.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/1.0",
    "modality": "X-ray · Lower limb",
    "alt": "AP radiograph of the legs in a child with rickets.",
    "caption": "AP radiograph of the legs in a child with rickets.",
    "findings": [
      "Both femurs are bowed.",
      "The bones appear relatively low in density."
    ],
    "limitation": "Radiographic findings require biochemical and clinical correlation; they do not establish the cause. This small source image is suitable for an overview of deformity, not detailed metaphyseal assessment.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  },
  {
    "lessonId": "jones-fracture",
    "src": "/pathology/jones-fracture.jpg",
    "width": 1279,
    "height": 1808,
    "author": "Lucien Monfils",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jonesfracture.jpg",
    "licence": "CC BY-SA 3.0",
    "licenceUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "modality": "X-ray · Lower limb",
    "alt": "Radiograph of a right fifth metatarsal fracture labelled as a Jones fracture by the source.",
    "caption": "Radiograph of a right fifth metatarsal fracture labelled as a Jones fracture by the source.",
    "findings": [
      "A transverse fracture line involves the proximal fifth metatarsal."
    ],
    "limitation": "Distinguish a Jones fracture from a tuberosity avulsion and a longitudinal unfused apophysis.",
    "changes": "Original published image retained, including any source annotations. No image edits by Bucky Lab.",
    "readingUrl": "https://www.radiologymasterclass.co.uk/tutorials/musculoskeletal/imaging-joints-bones/imaging-joints-and-bone"
  }
];
