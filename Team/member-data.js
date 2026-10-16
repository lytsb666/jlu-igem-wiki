// Original contribution records preserved; photos mapped from supplied filenames.
// Presentation instructions are separate from historical department/source data.
export const memberPresentation = {
  date: '2026-10-16',
  chineseNames: {
    "liuyu-yang": "杨鏐玉",
    "jingyi-kang": "康靖宜",
    "hengqi-deng": "邓恒奇",
    "tong-li": "李彤",
    "ziyi-dong": "董梓伊",
    "zhiyuan-jin": "金智媛",
    "xiaojie-meng": "孟小杰",
    "duo-zhang": "张朵",
    "mo-jin": "金墨",
    "guanbo-yin": "尹冠博",
    "botao-zhang": "张博韬",
    "ziyan-qin": "秦梓严",
    "haoyang-liu": "刘皓阳",
    "yu-xia": "夏宇",
    "ruiyao-guo": "郭睿垚",
    "jiale-wei": "韦佳乐",
    "shunyao-zhang": "张瞬尧",
    "wenxian-gao": "高文娴",
    "yujia-yang": "杨雨佳",
    "wensong-yao": "姚文松",
    "tonghui-yin": "尹桐辉",
    "yirui-lu": "鲁怡蕊",
    "bowen-xiao": "肖博文",
    "qianwen-luo": "骆茜雯",
    "wenqi-ai": "艾文琦",
    "qianwen-wang": "王芊雯",
    "jiale-zhang": "张家乐",
    "chen-xing": "邢辰",
    "sen-liang": "梁森",
    "chen-boyuan": "陈博远",
    "lanchao-sun": "孙兰超",
    "feiyue-wang": "王飞跃",
    "ziqiao-he": "何梓侨",
    "wang-pengtao": "王鹏涛",
    "hanyu-wang": "王晗宇",
    "luozhao-wang": "王洛钊",
    "ziyun-ma": "马子云",
    "pi-song-xiuling": "宋秀玲",
    "pi-pang-bo": "庞博",
    "pi-li-jinhua": "李金华",
    "secondary-pi-wang-juan": "王娟",
    "secondary-pi-su-guofan": "苏国范",
    "secondary-pi-zhao-chao": "赵超"
},
  // Advisor order and 马子云 spelling follow the user's latest instruction.
  advisors: ['sen-liang', 'chen-boyuan', 'lanchao-sun', 'feiyue-wang', 'ziqiao-he', 'wang-pengtao', 'hanyu-wang', 'luozhao-wang', 'ziyun-ma'],
  leadershipSource: {
    file: 'assets/team-member/sources/leader-list.png',
    originalFile: 'D:/WeChathis/xwechat_files/wxid_te2sfwdnpar522_2c28/temp/RWTemp/2026-10/b101f6cb78252293104820af9d06fdc5/dbbeea7bbbcc2d92fa836950ab2f7375.png',
    sha256: '7ec6a66cfdba289c4531f0735fceaef52ef5eb6aaac99b500c9c558cce1087fd',
    decision: 'User supplied this leader order and these responsibilities; department groups and earlier corrections are retained.',
  },
  leaders: [
    { id: 'mo-jin', role: 'Team Leader', rawText: 'Mo Jin,Team leader' },
    { id: 'jingyi-kang', role: 'Team Leader', rawText: 'Jingyi Kang,Team leader' },
    { id: 'zhiyuan-jin', role: 'Wet Lab Leader', rawText: 'Zhiyuan Jin,Wet lab leader' },
    { id: 'ziyan-qin', role: 'Dry Lab Leader', rawText: 'Ziyan Qin,Dry lab leader' },
    { id: 'yujia-yang', role: 'iHP Leader', rawText: 'Yujia Yang,iHP leader' },
    { id: 'wenxian-gao', role: 'Education Leader', rawText: 'Wenxian Gao,Education leader' },
    { id: 'tonghui-yin', role: 'Hardware Leader', rawText: 'Tonghui yin,Hardware leader' },
    { id: 'xiaojie-meng', role: 'Part Leader', rawText: 'Xiaojie Meng,Part leader' },
    { id: 'chen-xing', role: 'Visual Design Leader', rawText: 'Chen Xing,Visual design leader' },
  ],
  facultyNotes: {
    'pi-pang-bo': {
      text: 'Judge for iGEM Competition',
      source: 'Direct user instruction on 2026-10-13; no inferred biography or institutional title.',
    },
    'pi-li-jinhua': {
      text: 'Instructor of the 2025 iGEM Gold Medal-Winning Team with Two Nominations',
      source: 'Direct user instruction on 2026-10-13; does not create an Instructor section or person.',
    },
  },
}

export const teamMembers = [
  {
    "id": "liuyu-yang",
    "name": "Liuyu Yang",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "",
    "introduction": "Hi! I’m Liuyu Yang. This is my second iGEM journey. I’m excited to keep exploring, growing, and creating with my teammates. See you at the Jamboree!",
    "generalTasks": [
      "2",
      "6",
      "9"
    ],
    "contributionCategories": [
      "Visualization",
      "Project Administration",
      "Conceptualization"
    ],
    "tasks": [
      {
        "category": "Visualization",
        "detail": "Contributed to experimental data visualization and research workflow diagrams, as well as the layout, design, and visual optimization of presentation materials."
      },
      {
        "category": "Project Administration",
        "detail": "Contributed to project documentation, application materials, version control, and the coordination of project tasks and milestones, supporting the smooth progress of the team."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to the research design and technical roadmap, helping refine the project framework and optimize the overall research strategy."
      }
    ],
    "photo": "../assets/team-member/portraits/liuyu-yang.webp",
    "source": {
      "file": "Team Member-杨鏐玉.docx",
      "rawName": "Jingyi Kang",
      "rawRole": "Student leader"
    },
    "dataIssues": [
      {
        "type": "identity-conflict",
        "field": "name",
        "sourceValue": "Jingyi Kang",
        "resolution": "Display name follows the source filename: Liuyu Yang."
      },
      {
        "type": "field-mismatch",
        "field": "quote",
        "sourceValue": "The Quote field contains a self-introduction and no separate quote.",
        "resolution": "The text is retained as the introduction; quote remains empty."
      }
    ],
    "photoSource": {
      "file": "美工/杨liu玉.jpg",
      "status": "user-confirmed-alias",
      "cropPixels": [
        0,
        327,
        2181,
        3053
      ],
      "originalSha256": "93edf38b0f1093c858ae11146ab0a60bbb24c0343b237ae6cbee4bf605432a34",
      "groupReview": "Resolved by 00: original contribution role and groups retained.",
      "aliasConfirmation": {
        "authority": "human user",
        "date": "2026-10-03",
        "answer": "两张都对应原成员"
      }
    },
    "roleCorrection": {
      "date": "2026-10-04",
      "source": "10.4需求以及改动.docx / user instruction",
      "note": "Latest user correction supersedes earlier retained source grouping; biography and contribution records are unchanged."
    }
  },
  {
    "id": "jingyi-kang",
    "name": "Jingyi Kang",
    "role": "Team Leader",
    "groups": [
      "Team Leaders"
    ],
    "quote": "It is our choices that show what we truly are, far more than our abilities.",
    "introduction": "Hi everyone. I am Jingyi Kang from the School of Public Health at Jilin University. This year marks my second journey with iGEM and my first time serving as a team captain. Taking on this new role is both a valuable experience and a meaningful challenge for me. I would like to express my sincere gratitude to our instructors for their guidance and support, as well as to all of my teammates for their dedication, collaboration, and hard work throughout this journey. I look forward to continuing to learn, grow, and make progress together with everyone in the iGEM community. See you at the Jamboree!",
    "generalTasks": [
      "1",
      "2",
      "4",
      "6",
      "8",
      "11",
      "13"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Investigation",
      "Public Engagement",
      "Visualization",
      "Safety",
      "Project Administration"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Participated in organizing and analyzing experimental data and model outputs, comparing candidate performance and interpreting the performance of the detection system."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to the research design and technical roadmap, including the RPA primer–crRNA joint design strategy and the dry–wet lab closed-loop optimization framework."
      },
      {
        "category": "Investigation",
        "detail": "Participated in literature review, experimental documentation, and result compilation, supporting validation of the detection system and refinement of the research approach."
      },
      {
        "category": "Public Engagement",
        "detail": "Contributed to project presentations and defense preparation, highlighting the potential application of the project in rapid on-site detection of respiratory pathogens."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to experimental data visualization and research workflow diagrams, as well as the overall layout, design, and visual optimization of presentation slides."
      },
      {
        "category": "Safety",
        "detail": "Contributed to experimental standardization and biosafety documentation, supporting the safe and standardized implementation of experimental and testing procedures."
      },
      {
        "category": "Project Administration",
        "detail": "Contributed to evaluation forms and application materials, experimental documentation, version control, and coordination of project materials and milestones."
      }
    ],
    "photo": "../assets/team-member/portraits/jingyi-kang.webp",
    "source": {
      "file": "康靖宜.docx",
      "rawName": "Jingyi Kang",
      "rawRole": "Student leader"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Leader/康靖宜（team leader）.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        109,
        904,
        1239
      ],
      "originalSha256": "064d487d927354137206e7741e0e1a88352c732c9b675ec99dc4e18858786cab"
    }
  },
  {
    "id": "hengqi-deng",
    "name": "Hengqi Deng",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "Exploration begins with curiosity, but progress comes from turning questions into reproducible evidence.",
    "introduction": "Hi, I am Hengqi Deng from the School of Public Health at Jilin University. My academic background is in Radiation Medicine, and my research interests focus on molecular mechanisms of disease, oxidative stress, and biomedical applications. As a member of the Wetlab group, I participated in experimental design, laboratory work, data analysis, and optimization of the CRISPR-Cas12a-based respiratory pathogen detection system. Through iGEM, I have gained valuable experience in synthetic biology, experimental troubleshooting, and interdisciplinary teamwork.",
    "generalTasks": [
      "1",
      "2",
      "3",
      "4",
      "8",
      "9"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Background Research",
      "Investigation",
      "Safety",
      "Data Curation"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Participated in organizing and analyzing experimental data, comparing results under different reaction conditions, and evaluating the performance and reproducibility of the CRISPR-Cas12a detection system."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to the experimental design and optimization of the detection workflow, including discussion of the Cas12a-based detection strategy, reaction conditions, and validation approaches."
      },
      {
        "category": "Background Research",
        "detail": "Reviewed relevant literature on CRISPR-Cas12a detection, nucleic acid amplification, reaction optimization, and related experimental methods to support protocol design and interpretation of results."
      },
      {
        "category": "Investigation",
        "detail": "Participated in wet-lab experiments for construction, validation, and optimization of the CRISPR-Cas12a detection system, including experimental preparation, condition testing, and repeated validation of key procedures."
      },
      {
        "category": "Safety",
        "detail": "Followed laboratory biosafety requirements and standardized experimental procedures, and contributed to maintaining safe handling, operation, and disposal practices during wet-lab experiments."
      },
      {
        "category": "Data Curation",
        "detail": "Organized experimental records and raw data, maintained structured datasets for subsequent analysis, and assisted in compiling experimental results for project documentation and presentation."
      }
    ],
    "photo": "../assets/team-member/portraits/hengqi-deng.webp",
    "source": {
      "file": "Wet Lab 邓恒奇.docx",
      "rawName": "Hengqi Deng",
      "rawRole": "Wetlab）"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Wet/邓恒奇.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        557,
        3712,
        5197
      ],
      "originalSha256": "ccc6c0f81411772c5507439abbe3b3a4576612f9bda86b43eaf6040ab36fa045"
    }
  },
  {
    "id": "tong-li",
    "name": "Tong Li",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "Among countless choices, walk towards yourself.",
    "introduction": "Hi everyone. I am Tong Li from the School of Public Health at Jilin University. I serve as a Wetlab member of our iGEM team this year. Working in the wet lab brings me precious practical experience and continuous challenges. I sincerely thank our instructors for guidance and all teammates for teamwork. I keep exploring and optimizing experiments for our project. I look forward to learning and progressing together with everyone in the iGEM community.",
    "generalTasks": [
      "1",
      "3",
      "4",
      "7",
      "9",
      "10"
    ],
    "contributionCategories": [
      "Analysis",
      "Background Research",
      "Investigation",
      "Writing",
      "Data Curation",
      "Notebook / Record Keeping"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Participated in analyzing experimental data, optimizing primer and crRNA screening conditions, and assisting dry lab for model fine-tuning and pathogen-specific gene searching."
      },
      {
        "category": "Background Research",
        "detail": "Performed literature searching, collected crystal structure of Crisper-Cas12a and RSV structural diagrams to support our project background."
      },
      {
        "category": "Investigation",
        "detail": "Took part in wet-lab experiments, discussed experimental details and validated our pathogen detection system."
      },
      {
        "category": "Writing",
        "detail": "Contributed to part writing, drafted and revised Wiki background, principle and experimental technical sections."
      },
      {
        "category": "Data Curation",
        "detail": "Organized datasets for dry lab, sorted sequence information and experimental results for team usage."
      },
      {
        "category": "Notebook / Record Keeping",
        "detail": "Kept laboratory records, documented experimental optimization records and meeting notes during the whole journey."
      }
    ],
    "photo": "../assets/team-member/portraits/tong-li.webp",
    "source": {
      "file": "wet lab 李彤.docx",
      "rawName": "Tong Li",
      "rawRole": "Wetlab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Wet/李彤.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        173,
        1280,
        1773
      ],
      "originalSha256": "e87a9e1a7ebc66bdc78183c3441b642e22a341ecbba80feef3dc7d023a7785a8"
    }
  },
  {
    "id": "ziyi-dong",
    "name": "Ziyi Dong",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "The devil is the details.",
    "introduction": "Hi everyone. I am Ziyi Dong from the School of Public Health at Jilin University. It’s my first time participating in iGEM, serving as a wetlab member. Taking on this role is both a precious opportunity and a meaningful challenge for me. I would like to express my sincere gratitude to our instructors for their guidance and support, as well as to all of my teammates for their dedication and collaboration. I look forward to exploring synthetic biology combined with public health, learning and making progress together with everyone in the iGEM community.",
    "generalTasks": [
      "4",
      "6",
      "7",
      "10",
      "13"
    ],
    "contributionCategories": [
      "Investigation",
      "Visualization",
      "Writing",
      "Notebook / Record Keeping",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Investigation",
        "detail": "Participated in hands‑on laboratory operations, constructed experimental systems, collected and sorted raw experimental data. Assisted in evaluating the performance of the detection system and iteratively optimizing experimental conditions."
      },
      {
        "category": "Visualization",
        "detail": "Processed and analyzed raw experimental data, plotted fluorescence kinetic line graphs, edited and annotated figures to produce visual materials for project presentation."
      },
      {
        "category": "Writing",
        "detail": "Took part in drafting, revising and proofreading experimental protocols, and collaborated with teammates to polish documents."
      },
      {
        "category": "Notebook / Record Keeping",
        "detail": "Maintained standard laboratory notebooks, documented experimental systems, procedures, observations and results in real time to ensure full traceability of experiments."
      },
      {
        "category": "Public Engagement",
        "detail": "Joined project outreach and communication activities, introducing the principle and public health value of our rapid detection technology to the public."
      }
    ],
    "photo": "../assets/team-member/portraits/ziyi-dong.webp",
    "source": {
      "file": "Wetlab 董梓伊.docx",
      "rawName": "Ziyi Dong",
      "rawRole": "Wetlab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Wet/董梓伊.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        390,
        3712,
        5030
      ],
      "originalSha256": "eaa4da13555ed0b04b025745e282a1786fe227c91a297f24993b81b7433e694a"
    }
  },
  {
    "id": "zhiyuan-jin",
    "name": "Zhiyuan Jin",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "Be brave, Be humble",
    "introduction": "Hello! I'm Zhiyuan Jin from the School of Public Health, Jilin University. This is my second time participating in iGEM. I have gained tremendous growth throughout our preparation. Compared with last year, equipped with more experience, I took on the core wet-lab work of our team. I have further learned how to collaborate, face challenges head-on, and think from others' perspectives. Hope you enjoy our project! See you at the Jamboree!",
    "generalTasks": [
      "1",
      "2",
      "4",
      "7",
      "8",
      "10"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Investigation",
      "Writing",
      "Safety",
      "Notebook / Record Keeping"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "I analyzed data generated from wet-lab experiments and visualized the results in the form of fluorescence curves, tables and raw datasets. I also retrieved inspiring reference data by reviewing scientific literature. In addition, I read and analyzed the Wiki pages of previous iGEM teams in the Diagnostics track whose projects were closely related to ours, which helped us present our data analysis in a more accurate and intuitive manner."
      },
      {
        "category": "Conceptualization",
        "detail": "As a core team member involved in designing the overall project logic and drafting relevant content, I clarified the innovation and practical value of our project. I maintained close communication and coordination with teammates from the wet experiment, human practices, and hardware groups."
      },
      {
        "category": "Investigation",
        "detail": "As one of the core members performing wet-lab operations and the leader of the wet-lab subgroup, I guided other wet-lab teammates to carry out relevant experiments. I mainly conducted experiments using the model plasmid of the respiratory syncytial virus (RSV) N gene, and performed result documentation, plotting and data analysis for all tested pathogens."
      },
      {
        "category": "Writing",
        "detail": "I contributed to all Wiki content related to wet-lab work. Together with other subgroup leaders, I defined the structure of wet-lab sections on our Wiki. At the early stage, I drafted the outline for each section. During the mid-stage, I mainly wrote the Measurement, Design and Description sections. In the final phase, I reviewed and fine-tuned all wet-lab Wiki content for details."
      },
      {
        "category": "Safety",
        "detail": "I strictly followed iGEM, university and biosafety guidelines during all wet-lab operations. I maintained safe handling of nucleic acid samples and reaction reagents, and helped the team implement standard laboratory safety practices."
      },
      {
        "category": "Notebook / Record Keeping",
        "detail": "As a core member carrying out wet-lab operations, I continuously documented the reaction system and experimental results for every trial, and analyzed the outcomes obtained on the same day of each experiment."
      }
    ],
    "photo": "../assets/team-member/portraits/zhiyuan-jin-20261016.jpg",
    "source": {
      "file": "Wetlab 金智媛.docx",
      "rawName": "Zhiyuan Jin",
      "rawRole": "Member"
    },
    "dataIssues": [
      {
        "type": "role-normalization",
        "field": "role",
        "sourceValue": "Member",
        "resolution": "Normalized to Wet Lab Leader from the filename and introduction."
      }
    ],
    "photoSource": {
      "file": "Wet/金智媛.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        540,
        4000,
        5540
      ],
      "originalSha256": "93ec4452046bdeca41b074d64e4792bbf245bb6418ccf39fce625301ca2aaf24"
    },
    "roleCorrection": {
      "date": "2026-10-04",
      "source": "10.4需求以及改动.docx / user instruction",
      "note": "Latest user correction supersedes earlier retained source grouping; biography and contribution records are unchanged."
    }
  },
  {
    "id": "xiaojie-meng",
    "name": "Xiaojie Meng",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "Let everything grow into what it ought to be.",
    "introduction": "Hi everyone. I am Xiaojie Meng from the School of Public Health at Jilin University. As a first-time iGEM participant, I feel privileged to support our team’s daily work and grow alongside everyone throughout this project. I would like to extend my sincere gratitude to our instructors for their thoughtful guidance, and to all my teammates for their trust and dedicated collaboration. I deeply value this precious learning opportunity and look forward to advancing our project together.",
    "generalTasks": [
      "1",
      "3",
      "4",
      "7",
      "8"
    ],
    "contributionCategories": [
      "Analysis",
      "Background Research",
      "Investigation",
      "Writing",
      "Safety"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Collated and analyzed data from published literature and previous iGEM projects, providing supporting evidence for the team’s project design and result discussion."
      },
      {
        "category": "Background Research",
        "detail": "Searched and collected relevant papers and literature for the project."
      },
      {
        "category": "Investigation",
        "detail": "Collected documentary evidence from literature to complement the project’s research foundation."
      },
      {
        "category": "Writing",
        "detail": "Drafted, reviewed and edited content for the team Wiki, focusing on the Parts section of the project for public release."
      },
      {
        "category": "Safety",
        "detail": "Sorted out iGEM safety rules and institutional biosafety requirements, and assisted in checking the compliance of project activities with relevant safety standards."
      }
    ],
    "photo": "../assets/team-member/portraits/xiaojie-meng.webp",
    "source": {
      "file": "wetlab 孟小杰.docx",
      "rawName": "Xiaojie Meng",
      "rawRole": "Wetlab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Wet/孟小杰.png",
      "status": "filename-match",
      "cropPixels": [
        0,
        176,
        1672,
        2266
      ],
      "originalSha256": "74c3ea997228a596b4329495cde992980b4415d50d946f94fe23bbc1e343ef05"
    }
  },
  {
    "id": "duo-zhang",
    "name": "Duo Zhang",
    "role": "Wet Lab",
    "groups": [
      "Wet Lab"
    ],
    "quote": "The road ahead is long and arduous; I will seek the truth high and low.",
    "introduction": "Hi everyone. I am Duo Zhang from the Third Bethune Clinical Medical College. This is my first time participating in iGEM, and it has been a truly special experience for me. Along the way, I have learned a lot, gained new skills, and discovered the importance of teamwork and communication. I feel fortunate to have shared this journey with such supportive mentors and teammates, whose help and encouragement made my first iGEM experience both enjoyable and rewarding. I hope to carry what I have learned into my future studies and continue exploring new possibilities.",
    "generalTasks": [
      "3",
      "4",
      "6",
      "7",
      "8"
    ],
    "contributionCategories": [
      "Background Research",
      "Investigation",
      "Visualization",
      "Writing",
      "Safety"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Conducted literature research on RPA and CRISPR-Cas12a technologies, focusing on their principles, key techniques, and the molecular mechanism of Cas12a-based detection."
      },
      {
        "category": "Investigation",
        "detail": "Participated in gene sequence collection and data organization, contributing to standardized sequence collection and supporting subsequent research and modeling."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to data visualization using Origin and helped optimize the structure and presentation of project documents to improve clarity and readability."
      },
      {
        "category": "Writing",
        "detail": "Contributed to the writing and organization of the team Wiki, including Notebook content for respiratory pathogens, and completed the Part documentation for GAS and BP."
      },
      {
        "category": "Safety",
        "detail": "Contributed to the writing and organization of the Wiki Safety section, including laboratory safety, self-checks, product safety, and other relevant safety information."
      }
    ],
    "photo": "../assets/team-member/portraits/duo-zhang.webp",
    "source": {
      "file": "Wetlab 张朵.docx",
      "rawName": "Duo Zhang",
      "rawRole": "Wetlab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Wet/张朵.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        600,
        4000,
        5600
      ],
      "originalSha256": "e5de4fe2a6abfffb5781a36611a962ced940f4316211aabe2e7e3051ce8f8e94"
    }
  },
  {
    "id": "mo-jin",
    "name": "Mo Jin",
    "role": "Hardware & Wiki",
    "groups": [
      "Hardware & Wiki"
    ],
    "quote": "Every step counts.",
    "introduction": "Hi everyone. I am Jin Mo from the School of Public Health at Jilin University. This is my first time participating in iGEM. This competition has been a rewarding journey full of exploration and growth for me. iGEM provides a fantastic platform for me to communicate with iGEMers from different countries and universities. It is inspiring to discuss synthetic biology together with all these passionate minds. I would like to express my sincere gratitude to our instructors for their patient guidance, and to all my teammates for their continuous support, close cooperation and persistent efforts. I look forward to exchanging ideas, learning and growing together with everyone in the iGEM community. See you in Paris!",
    "generalTasks": [
      "2",
      "4",
      "6",
      "13",
      "15",
      "16"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Investigation",
      "Visualization",
      "Public Engagement",
      "Hardware",
      "Software"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Contributed to the project framework and detection workflow, including the integration of biological detection, hardware, and practical application scenarios."
      },
      {
        "category": "Investigation",
        "detail": "Participated in literature review, technical research, and organization of experimental information related to respiratory pathogen detection."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to Wiki design, presentation slides, scientific diagrams, workflow illustrations, and data visualization, supporting the overall visual communication of the project."
      },
      {
        "category": "Public Engagement",
        "detail": "Contributed to project communication and presentation materials, highlighting applications in kindergartens, eldercare, and primary healthcare settings."
      },
      {
        "category": "Hardware",
        "detail": "Participated in the design, documentation, and presentation of the portable detection device, including its functions, workflow, and application scenarios."
      },
      {
        "category": "Software",
        "detail": "Contributed to the organization and presentation of analytical and software-related components within the overall detection workflow."
      }
    ],
    "photo": "../assets/team-member/portraits/mo-jin.webp",
    "source": {
      "file": "Dry Lab 金墨.docx",
      "rawName": "Mo Jin",
      "rawRole": "Dry Lab"
    },
    "dataIssues": [
      {
        "type": "name-order-conflict",
        "field": "name",
        "sourceValue": "Team Member says 'Mo Jin'; introduction says 'Jin Mo'.",
        "resolution": "Display name follows the Team Member field: Mo Jin."
      }
    ],
    "photoSource": {
      "file": "Hardware/金墨.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        545,
        3305,
        4677
      ],
      "originalSha256": "3fbd79afe003df9867e3ed9cb38847cd09684f3d39cd7279d067a019b8885af9",
      "groupReview": "Resolved by 00: original contribution role and groups retained."
    },
    "roleCorrection": {
      "date": "2026-10-04",
      "source": "10.4需求以及改动.docx / user instruction",
      "note": "Latest user correction supersedes earlier retained source grouping; biography and contribution records are unchanged."
    }
  },
  {
    "id": "guanbo-yin",
    "name": "Guanbo Yin",
    "role": "Dry Lab",
    "groups": [
      "Dry Lab"
    ],
    "quote": "Look before you leap; ponder well before you act.",
    "introduction": "Hi everyone! I am Guanbo Yin from the School of Public Health at Jilin University. This is my first time participating in the iGEM competition. For me, taking part in this contest has been an extremely valuable and novel experience. I would like to sincerely thank our instructors for their guidance and support. I am also grateful to all my teammates for their help and tolerance towards me throughout our preparation journey. I hope to keep learning, growing, and making progress together with everyone within the iGEM community!",
    "generalTasks": [
      "6",
      "7",
      "16"
    ],
    "contributionCategories": [
      "Visualization",
      "Writing",
      "Software"
    ],
    "tasks": [
      {
        "category": "Visualization",
        "detail": "contributed to partial experimental data visualization and the creation of research workflow diagrams, supporting the visual presentation of our project."
      },
      {
        "category": "Writing",
        "detail": "contributed to writing the Feishu document for the enzyme-kinetic model and revising part of the dataset."
      },
      {
        "category": "Software",
        "detail": "contributed to modifying the code for the enzyme-kinetic model and adjusting portions of experimental data."
      }
    ],
    "photo": "../assets/team-member/portraits/guanbo-yin.webp",
    "source": {
      "file": "drylab尹冠博.docx",
      "rawName": "Guanbo Yin",
      "rawRole": "Drylab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Dry/尹冠博.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        154,
        1280,
        1754
      ],
      "originalSha256": "b4d4d6ad1e2705f1fcd0fd33549ecf4c39d07e1450b8fbf02d53084c032728eb"
    }
  },
  {
    "id": "botao-zhang",
    "name": "Botao Zhang",
    "role": "Dry Lab",
    "groups": [
      "Dry Lab"
    ],
    "quote": "What we cannot imagine, we can not build.",
    "introduction": "Hi everyone. I am Botao Zhang from the School of Public Health at Jilin University. I am a member of the Drylab team. My main work involves data analysis, conceptualization, and visualization. I build statistical models to process experimental data and explore underlying patterns to support wet-lab design. Cross-disciplinary communication between wet and dry labs deepens my understanding of synthetic biology. I cherish this iGEM experience and am thankful for all the teammates fighting alongside me.",
    "generalTasks": [
      "1",
      "2",
      "4",
      "5",
      "6",
      "13"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Investigation",
      "Wiki Coding",
      "Visualization",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Process raw wet-lab data and perform statistical analysis. Apply quantile regression models to explore variable relationships and evaluate the performance of our detection system."
      },
      {
        "category": "Conceptualization",
        "detail": "Take part in brainstorming sessions, discuss technical routes, contribute to the design of the RPA-CRISPR detection system, and refine the closed-loop workflow between wet and dry labs."
      },
      {
        "category": "Investigation",
        "detail": "Review relevant literature, extract parameters and research findings, and provide theoretical support for modeling and experimental schemes."
      },
      {
        "category": "Wiki Coding",
        "detail": "Participate in building the team Wiki website, write and debug webpage codes, and develop the contribution section and data display pages."
      },
      {
        "category": "Visualization",
        "detail": "Draw research flowcharts and model diagrams, visualize experimental results, and assist in visual design for Wiki and presentation slides."
      },
      {
        "category": "Public Engagement",
        "detail": "Help draft popular science content, prepare presentation materials, and introduce the application value of our rapid pathogen detection project to the public."
      }
    ],
    "photo": "../assets/team-member/portraits/botao-zhang.webp",
    "source": {
      "file": "Drylab张博韬.docx",
      "rawName": "Botao Zhang",
      "rawRole": "Drylab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Dry/张博韬.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        557,
        3712,
        5197
      ],
      "originalSha256": "ff888221bce132fafcaaa5231adf4f0369b4c20bfef42b14b90a4eff4f25a3c3"
    }
  },
  {
    "id": "ziyan-qin",
    "name": "Ziyan Qin",
    "role": "Dry Lab",
    "groups": [
      "Dry Lab"
    ],
    "quote": "Life is a rugged paper, which just writes my page.",
    "introduction": "Hello！I am Ziyan Qin from the School of Pharmacy at Jilin University. Beyond pharmaceutical studies, I am deeply fascinated by artificial intelligence and mathematical modeling. I enjoy exploring how computational tools can empower biomedical research. I keep practicing data-related thinking and hope to combine pharmacy knowledge with AI-driven modeling. I am eager to learn cross-disciplinary skills and make practical attempts at interdisciplinary innovation.",
    "generalTasks": [
      "4",
      "6",
      "1",
      "2",
      "3",
      "4",
      "7",
      "8"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Background Research",
      "Investigation",
      "Writing",
      "Data Curation"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "I evaluated DNABERT-6 model performance via metrics and ablation tests, and analyzed simulation outputs against RSV wet-lab results."
      },
      {
        "category": "Conceptualization",
        "detail": "I co-designed the dual-module dry-lab workflow and proposed key strategies for model training and PDE construction."
      },
      {
        "category": "Background Research",
        "detail": "I reviewed relevant literature of RPA-CRISPR and DNA language models, and gathered kinetic parameters for modeling."
      },
      {
        "category": "Investigation",
        "detail": "I built and validated the ranking model, constructed reaction-diffusion simulation framework, and generated primer-crRNA candidates for wet-lab use."
      },
      {
        "category": "Writing",
        "detail": "I drafted and revised dry-lab Wiki content including model outcomes and mathematical descriptions."
      },
      {
        "category": "Data Curation",
        "detail": "I collected and filtered literature-sourced datasets from GenBank, and computed features as well as annotated metadata for model training."
      }
    ],
    "photo": "../assets/team-member/portraits/ziyan-qin.webp",
    "source": {
      "file": "秦梓严.docx",
      "rawName": "Ziyan Qin",
      "rawRole": "Drylab"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Dry/秦梓严.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        173,
        960,
        1373
      ],
      "originalSha256": "3a7ada230dd1365fa63bc5292d363da9b18f6fae68c22baf4ea5990a8b4f30ee"
    }
  },
  {
    "id": "haoyang-liu",
    "name": "Haoyang Liu",
    "role": "Dry Lab",
    "groups": [
      "Dry Lab"
    ],
    "quote": "",
    "introduction": "Hi! I’m Haoyang Liu. This is my first iGEM journey. I’m excited to learn, explore, embrace new challenges, and create unforgettable memories with my teammates. See you at the Jamboree!",
    "generalTasks": [
      "1",
      "4",
      "9",
      "16"
    ],
    "contributionCategories": [
      "Analysis",
      "Investigation",
      "Data Curation",
      "Software"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Participated in analyzing experimental data and model outputs, comparing candidate performance, and interpreting results to evaluate and optimize the detection system."
      },
      {
        "category": "Investigation",
        "detail": "Conducted literature reviews and participated in experimental documentation and result interpretation, supporting the validation and refinement of the research approach."
      },
      {
        "category": "Data Curation",
        "detail": "Organized, reviewed, and maintained experimental and computational data, ensuring consistency and traceability for subsequent analysis and project documentation."
      },
      {
        "category": "Software",
        "detail": "Contributed to the development and application of computational tools for data processing and model-assisted analysis, supporting the integration and optimization of the dry–wet lab workflow."
      }
    ],
    "photo": "../assets/team-member/portraits/haoyang-liu.webp",
    "source": {
      "file": "刘皓阳.docx",
      "rawName": "Haoyang Liu",
      "rawRole": "Member"
    },
    "dataIssues": [
      {
        "type": "field-mismatch",
        "field": "quote",
        "sourceValue": "The Quote field contains an introduction and no separate quote.",
        "resolution": "The text is retained as the introduction; quote remains empty."
      },
      {
        "type": "role-normalization",
        "field": "role",
        "sourceValue": "Member",
        "resolution": "Normalized to Dry Lab from software, model, and data contributions."
      }
    ],
    "photoSource": {
      "file": "Dry/刘皓阳.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        192,
        1280,
        1792
      ],
      "originalSha256": "f2b5006eab2605c6552c8cafe4d0289d5a450dd4e3f82c5510aa5ac09eab30a5"
    }
  },
  {
    "id": "yu-xia",
    "name": "Yu Xia",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "Creativity turns ideas into impact, and collaboration makes that impact last.",
    "introduction": "Hi everyone. I am Xia Yu, a Class of 2024 student majoring in Radiation Medicine at the School of Public Health. In our iGEM team, I work mainly in Human Practices, with a particular focus on entrepreneurship, content development, and Wiki production. I also collaborate closely with the Education and HP groups on activity planning and public-facing communication. Through this experience, I hope to connect scientific ideas with real-world needs and contribute to the team through creativity, communication, and coordination.",
    "generalTasks": [
      "5",
      "6",
      "7",
      "11",
      "13",
      "14"
    ],
    "contributionCategories": [
      "Wiki Coding",
      "Visualization",
      "Writing",
      "Project Administration",
      "Public Engagement",
      "Entrepreneurship"
    ],
    "tasks": [
      {
        "category": "Wiki Coding",
        "detail": "Contributed to the production and organization of the team Wiki, helping transform project materials into clear, structured, and accessible online content and coordinating Wiki-related materials across different sections."
      },
      {
        "category": "Visualization",
        "detail": "Participated in the visual and structural design of entrepreneurship-related materials and Wiki content, improving the presentation of key information and helping maintain a coherent style for public-facing project outputs."
      },
      {
        "category": "Writing",
        "detail": "Drafted, reviewed, and edited written materials for the entrepreneurship, Education, and HP groups, and contributed to the writing and editing of articles for the team’s official WeChat public account and other outward-facing content."
      },
      {
        "category": "Project Administration",
        "detail": "Supported communication and coordination among different subgroups, assisted with the organization and follow-up of shared tasks, and participated in financial statistics and record compilation to support orderly project implementation."
      },
      {
        "category": "Public Engagement",
        "detail": "Assisted the Education and HP groups in designing outreach and educational activities, developing activity content and supporting materials to communicate the project and related scientific topics to broader audiences."
      },
      {
        "category": "Entrepreneurship",
        "detail": "Took primary responsibility for the design and written development of the entrepreneurship section, helping organize business-oriented ideas, refine relevant materials, and present the project’s potential value and application in a clear and coherent manner."
      }
    ],
    "photo": "../assets/team-member/portraits/yu-xia.webp",
    "source": {
      "file": "HP 夏宇.docx",
      "rawName": "Yu Xia",
      "rawRole": "HP"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/夏宇.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        246,
        2730,
        3658
      ],
      "originalSha256": "399a7c0751d801c3016ba32ab20e45200be668b1ec9e4033b117b69a1915c8c9"
    }
  },
  {
    "id": "ruiyao-guo",
    "name": "Ruiyao Guo",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "The best time to plant a tree was ten years ago. The second best time is now.",
    "introduction": "Hi everyone. I am Ruiyao Guo from the School of Public Health at Jilin University. This year marks my first journey with iGEM, and I am truly excited to be part of this amazing community. As a newcomer, I am eager to learn, collaborate, and grow alongside talented teammates from around the world. I would like to express my sincere gratitude to our instructors for their guidance and support, and to all my teammates for their dedication and teamwork.",
    "generalTasks": [
      "7",
      "11",
      "13"
    ],
    "contributionCategories": [
      "Writing",
      "Project Administration",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Writing",
        "detail": "Drafted activity proposals, Wiki content, and articles for the team’s WeChat Official Account."
      },
      {
        "category": "Project Administration",
        "detail": "Coordinated and organized the execution of Human Practices offline activities."
      },
      {
        "category": "Public Engagement",
        "detail": "Participated in nearly all Human Practices offline activities and communicated synthetic biology concepts to the public."
      }
    ],
    "photo": "../assets/team-member/portraits/ruiyao-guo.webp",
    "source": {
      "file": "HP+郭睿垚.docx",
      "rawName": "Ruiyao Guo",
      "rawRole": "HP"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/郭睿垚.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        154,
        1280,
        1754
      ],
      "originalSha256": "46847bf48d4d1b53ccb4cb07feb4c967db13695d492534195b56a8e9474c34bd"
    }
  },
  {
    "id": "jiale-wei",
    "name": "Jiale Wei",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "To cure sometimes, to relieve often, to comfort always.",
    "introduction": "Hi everyone. I am Jiale Wei from the School of Public Health, Jilin University. This is my first iGEM journey, and I serve as a member of the Human Practices team. This collaborative adventure has granted me precious new perspectives and reflections. I hold sincere gratitude to our instructors and teammates for walking this path together. I look forward to exchanging ideas and growing alongside everyone in the iGEM community. See you at the Jamboree!",
    "generalTasks": [
      "1",
      "2",
      "3",
      "6",
      "7",
      "13"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Background Research",
      "Visualization",
      "Writing",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Process and analyze expert scoring data from various stakeholders and construct the stakeholder model through topological analysis."
      },
      {
        "category": "Conceptualization",
        "detail": "Participate in the design of the HP group’s working framework, and take responsibility for Wiki webpage content planning, model development, and science outreach activity design."
      },
      {
        "category": "Background Research",
        "detail": "Review relevant literature on stakeholders and related fields, providing a literature-based foundation and methodological guidance for HP research."
      },
      {
        "category": "Visualization",
        "detail": "Complete the layout and interactive interface design of the Stakeholder Map Wiki page, and assist in the design optimization of other HP Wiki pages."
      },
      {
        "category": "Writing",
        "detail": "Write and edit Wiki webpage content and prepare various documents, including activity-related materials."
      },
      {
        "category": "Public Engagement",
        "detail": "Participate in the planning and pre-event preparation of multiple public engagement activities, and organize post-event materials and documentation for Wiki archiving."
      }
    ],
    "photo": "../assets/team-member/portraits/jiale-wei.webp",
    "source": {
      "file": "HP韦佳乐.docx",
      "rawName": "Jiale Wei",
      "rawRole": "HP"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/韦佳乐.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        360,
        4000,
        5360
      ],
      "originalSha256": "186053e4c0e0bea01e59e1a06628c26b48ffaf764f7eb3b41ca15dcb5d0c9664"
    }
  },
  {
    "id": "shunyao-zhang",
    "name": "Shunyao Zhang",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "Real change comes from small but continuous efforts.",
    "introduction": "Hi everyone. I am a student majoring in Preventive Medicine from the School of Public Health at Jilin University. As an HP member of our iGEM team, I am responsible for human practice‑related work. I took part in science‑popularization activities and questionnaire research, combining public‑health knowledge with our synthetic‑biology project. I have improved my communication and collaborative ability and I am grateful for teammates’ support.",
    "generalTasks": [
      "2",
      "3",
      "7",
      "11",
      "13",
      "6"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Background Research",
      "Writing",
      "Project Administration",
      "Public Engagement",
      "Visualization"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Joined team brainstorming, put forward public‑health‑oriented suggestions for human practice activity planning and project promotion strategy."
      },
      {
        "category": "Background Research",
        "detail": "Reviewed relevant public‑health literature and policy guidelines, collected supporting materials for our HP activity design."
      },
      {
        "category": "Writing",
        "detail": "Drafted and revised human‑practice content for Wiki, organized interview transcripts and activity summary documents."
      },
      {
        "category": "Project Administration",
        "detail": "Assisted in coordinating HP‑related work, arranged activity schedules and sorted out relevant supporting materials."
      },
      {
        "category": "Public Engagement",
        "detail": "Participated in organizing and carrying out science‑popularization work, completed questionnaire distribution and community‑oriented investigation combined with preventive‑medicine perspectives."
      },
      {
        "category": "Visualization",
        "detail": "Assisted in producing HP‑related presentation slides, sorted activity photos and made graphic materials for Wiki pages."
      }
    ],
    "photo": "../assets/team-member/portraits/shunyao-zhang.webp",
    "source": {
      "file": "HP组  张瞬尧.docx",
      "rawName": "Shunyao Zhang",
      "rawRole": "HP Member"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/张瞬尧.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        390,
        3712,
        5030
      ],
      "originalSha256": "871654f7cb6e73d98c8ffb08f326fa0e12d839bd903e6c332f7d80479e9b1596"
    }
  },
  {
    "id": "wenxian-gao",
    "name": "Wenxian Gao",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "The best way to predict the future is to create it.",
    "introduction": "Hi everyone! I am Wenxian Gao from the School of Management, Jilin University, majoring in Financial Management. This is my first iGEM journey, and I am honored to serve on the Human Practices team. With a background in management and finance, I focus on bridging laboratory science and the public — from communication research and questionnaire design to project coordination and presentation. I am sincerely grateful to our instructors and teammates for their guidance and support. I look forward to learning and growing together with everyone in the iGEM community. See you at the Jamboree!",
    "generalTasks": [
      "1",
      "2",
      "6",
      "7",
      "8",
      "11",
      "13",
      "14"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Visualization",
      "Writing",
      "Safety",
      "Project Administration",
      "Public Engagement",
      "Entrepreneurship"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Participated in collecting and analyzing data from HP activities, including questionnaire results and feedback from interviews with experts and the public, and translated stakeholder insights into concrete suggestions for project improvement."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to the overall Education framework and communication strategy, designing engagement activities that connect the rapid on-site detection system with real public needs and concerns."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to the design and layout of presentation slides, data visualization for HP results, and infographics used in science communication materials."
      },
      {
        "category": "Writing",
        "detail": "Contributed to HP documentation, science communication articles, and wiki content describing the project's social value and engagement activities."
      },
      {
        "category": "Safety",
        "detail": "Contributed to the Human Practices safety documentation, including the assessment of legal and regulatory risks, supporting the responsible, compliant, and standardized implementation of the project."
      },
      {
        "category": "Project Administration",
        "detail": "Contributed to evaluation forms and application materials, experimental documentation, version control, and coordination of project materials and milestones."
      },
      {
        "category": "Public Engagement",
        "detail": "Participated in project presentations and defense preparation, as well as science communication activities highlighting the potential application of the project in rapid on-site detection of respiratory pathogens."
      },
      {
        "category": "Entrepreneurship",
        "detail": "Contributed to exploring the project's social impact and entrepreneurial potential, including its application model for rapid on-site detection in resource-limited and community settings."
      }
    ],
    "photo": "../assets/team-member/portraits/wenxian-gao.webp",
    "source": {
      "file": "HP组+高文娴.docx",
      "rawName": "Wenxian Gao",
      "rawRole": "HP"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/高文娴.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        540,
        4000,
        5540
      ],
      "originalSha256": "8ee1debaab06d9b2d712527dd008ceb9fc620acce5b0dd22768b3e0f1537e74c"
    }
  },
  {
    "id": "yujia-yang",
    "name": "Yujia Yang",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "Listening carefully and writing clearly turn human practices into real project direction.",
    "introduction": "Hi everyone. I am Yujia Yang, a 2023 Clinical Medicine student from Bethune First Clinical Medical College of Jilin University. In our team, I mainly worked in Human Practices, especially the design, writing, and Wiki presentation of the Integrated Human Practices section. With a clinical background, I tried to connect stakeholder feedback with the needs of patients, healthcare workers, and community settings. I also supported the Education and HP groups in activity planning, text writing, and WeChat public account editing, while helping coordinate communication among different subgroups.",
    "generalTasks": [
      "2",
      "5",
      "6",
      "7",
      "11",
      "13"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Wiki Coding",
      "Visualization",
      "Writing",
      "Project Administration",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Contributed to the design of the IHP framework by organizing stakeholder needs, clinical perspectives, and project questions into a clear Human Practices storyline. Helped clarify how the project connected rapid respiratory pathogen detection with real clinical and community needs."
      },
      {
        "category": "Wiki Coding",
        "detail": "Supported the construction and organization of IHP-related Wiki pages, including page structure, content placement, and coordination of materials for the Wiki presentation of Human Practices work."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to the visual presentation of IHP content on the Wiki, helping make stakeholder interviews, activity logic, and project feedback easier for readers to follow."
      },
      {
        "category": "Writing",
        "detail": "Drafted, revised, and polished IHP documents and HP-related texts. Also assisted the Education and HP groups with activity descriptions, educational materials, and WeChat public account drafts."
      },
      {
        "category": "Project Administration",
        "detail": "Participated in communication and coordination among different subgroups, helping align HP, Education, and Wiki materials with the team's overall project progress and documentation needs."
      },
      {
        "category": "Public Engagement",
        "detail": "Assisted in the planning of Education and HP activities, helping transform project ideas into accessible engagement content for students, community participants, and broader public audiences."
      }
    ],
    "photo": "../assets/team-member/portraits/yujia-yang.webp",
    "source": {
      "file": "杨雨佳team member.docx",
      "rawName": "Yujia Yang",
      "rawRole": "Human Practices"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/杨雨佳.png",
      "status": "filename-match",
      "cropPixels": [
        0,
        480,
        4000,
        5480
      ],
      "originalSha256": "56bf1923304a5a5700703d3ab855e7c0f6df0c3aef067637797913f46a9c3355"
    }
  },
  {
    "id": "wensong-yao",
    "name": "Wensong Yao",
    "role": "Human Practices",
    "groups": [
      "Human Practices"
    ],
    "quote": "The best way to predict your future is to create it.",
    "introduction": "Hi everyone. I am Wensong Yao from the School of Public Health at Jilin University. In our team, I mainly focus on Human Practices, bridging the gap between synthetic biology and the broader public. Taking on this role is a valuable experience for me to explore ethical boundaries, engage with diverse communities, and contribute to our business plans. I look forward to sharing our vision and making progress together with everyone in the iGEM community.",
    "generalTasks": [
      "6",
      "7",
      "8",
      "11",
      "13",
      "14"
    ],
    "contributionCategories": [
      "Visualization",
      "Writing",
      "Safety",
      "Project Administration",
      "Public Engagement",
      "Entrepreneurship"
    ],
    "tasks": [
      {
        "category": "Visualization",
        "detail": "Contributed to the voiceover script for the promotion video and the visual design and optimization of presentation slides."
      },
      {
        "category": "Writing",
        "detail": "Participated in writing and editing various Wiki contents, including offline event documentation, ethical evaluation models, and cross-cultural translation materials."
      },
      {
        "category": "Safety",
        "detail": "Contributed to travel logistics and safety guarantees for team members attending conferences, including drafting safety commitment letters and organizing insurance."
      },
      {
        "category": "Project Administration",
        "detail": "Contributed to the recording of HP group activities, organized meeting materials, and maintained team archives to ensure work transparency."
      },
      {
        "category": "Public Engagement",
        "detail": "Contributed to the planning and execution of multiple offline outreach activities targeted at diverse populations, and assisted in team social media operations."
      },
      {
        "category": "Entrepreneurship",
        "detail": "Contributed to the drafting of the business plan, focusing on market pain points and sales strategies."
      }
    ],
    "photo": "../assets/team-member/portraits/wensong-yao.webp",
    "source": {
      "file": "姚文松.docx",
      "rawName": "Wensong Yao",
      "rawRole": "HP"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/姚文松.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        445,
        3712,
        5085
      ],
      "originalSha256": "deab2aa53e35253f02cd6a57539e5eab4d02e7534c22c8601aa19429e5bd122f"
    }
  },
  {
    "id": "tonghui-yin",
    "name": "Tonghui Yin",
    "role": "Human Practices · Hardware",
    "groups": [
      "Human Practices",
      "Hardware & Wiki"
    ],
    "quote": "How do you transform the tartness of life—like that of a lemon—into a sweetness reminiscent of lemon soda?",
    "introduction": "Hello everyone! I am Tonghui Yin from the Department of Radiological Medicine at the School of Public Health, Jilin University. It is a great pleasure to be on such a distinguished platform as iGEM. This is my first time participating in iGEM, and I hope that through this experience, each of us can unlock our potential and discover what we truly aspire to pursue. See you in Paris!",
    "generalTasks": [],
    "contributionCategories": [
      "Conceptualization",
      "Writing",
      "Fundraising",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "I am responsible for developing the activity outlines for the HP group's IHP and Education sections, including identifying which activities to organize and how to execute them."
      },
      {
        "category": "Writing",
        "detail": "Responsible for drafting portions of the manuscript pertaining to IHP, Eduction, and hardware."
      },
      {
        "category": "Fundraising",
        "detail": "Responsible for identifying institutions such as kindergartens and nursing homes to conduct HP activities and test our equipment, as well as seeking relevant enterprises to provide iterative consulting services for existing instruments."
      },
      {
        "category": "Public Engagement",
        "detail": "Responsible for organizing activities related to HP and education."
      }
    ],
    "photo": "../assets/team-member/portraits/tonghui-yin.webp",
    "source": {
      "file": "尹桐辉 Team Member Contribution.docx",
      "rawName": "Tonghui Yin",
      "rawRole": "HP and instrument"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "HP/尹桐辉.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        134,
        1280,
        1734
      ],
      "originalSha256": "9fa18eca1b5f5068fac7bdea119241de15b01928ce6616e34646aa2f04c5821c"
    }
  },
  {
    "id": "yirui-lu",
    "name": "Yirui Lu",
    "role": "Hardware & Wiki",
    "groups": [
      "Hardware & Wiki"
    ],
    "quote": "Stay curious, keep creating, and turn every challenge into a step toward something better.",
    "introduction": "Hi everyone. I am Yirui Lu from the School of Software Engineering at Jilin University. Joining iGEM has given me a valuable opportunity to explore interdisciplinary collaboration and experience the process of turning ideas into practice. Throughout this journey, I have learned a lot from every challenge and every collaboration. I sincerely appreciate the guidance and support from our instructors, as well as the dedication and encouragement of my teammates. I look forward to continuing to learn, grow, and create more wonderful memories with everyone in the iGEM community.",
    "generalTasks": [
      "4",
      "6",
      "5",
      "6",
      "7",
      "16"
    ],
    "contributionCategories": [
      "Wiki Coding",
      "Visualization",
      "Writing",
      "Software"
    ],
    "tasks": [
      {
        "category": "Wiki Coding",
        "detail": "Participated in the development and implementation of the team Wiki, including the initial website framework, loading effects, mouse interactions, homepage animations, and the coding and optimization of related pages."
      },
      {
        "category": "Visualization",
        "detail": "Contributed to the visual design and presentation of the team Wiki, including page layouts, animations, diagrams, and other visual materials. Also coordinated with the design team to maintain consistency in style, color schemes, images, and overall presentation."
      },
      {
        "category": "Writing",
        "detail": "Contributed to the writing, revision, and organization of Wiki content, particularly the software-related sections, and helped improve the clarity, structure, and consistency of the content presented on the website."
      },
      {
        "category": "Software",
        "detail": "Contributed to the software-related work of the detection device, including organizing software materials, preparing introductory and explanatory scripts, planning the presentation of software functions and user guidance, and integrating software-related content into the team Wiki."
      }
    ],
    "photo": "../assets/team-member/portraits/yirui-lu.webp",
    "source": {
      "file": "hardware鲁怡蕊(1).docx",
      "rawName": "Yirui Lu",
      "rawRole": "Wiki ; Hardware"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Hardware/鲁怡蕊.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        660,
        4000,
        5660
      ],
      "originalSha256": "83029da7faa3be9e2a19f78eb64a1dd01fee1f9dd0173feb56bb95e165d4f5a9"
    }
  },
  {
    "id": "bowen-xiao",
    "name": "Bowen Xiao",
    "role": "Hardware",
    "groups": [
      "Hardware & Wiki"
    ],
    "quote": "The best way to predict the future is to invent it.",
    "introduction": "Hi everyone. I am Bowen Xiao from the School of Communication Engineering, Jilin University. My study focuses on electronic engineering, embedded systems, and software development. In this iGEM project, I am mainly responsible for the hardware design and development, as well as the software implementation, building the physical detection platform and its control and data-processing programs. I enjoy turning biological ideas into practical and reliable engineering devices, and I look forward to learning and growing together with my teammates in the iGEM community.",
    "generalTasks": [
      "1",
      "2",
      "11",
      "12",
      "14"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Hardware",
      "Software",
      "Visualization"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Analyzed the performance data of the hardware and software system, including sensor accuracy, response time, and system stability, to support the iterative optimization of the detection platform."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to brainstorming and developing the technical roadmap of the project, especially the integrated hardware-software solution for the detection system."
      },
      {
        "category": "Hardware",
        "detail": "Designed, built, and tested the hardware system, including circuit design, PCB layout, embedded controller programming, and the integration of sensors and actuators into the detection platform."
      },
      {
        "category": "Software",
        "detail": "Developed, implemented, and tested the software, including the control program for the hardware system, the data acquisition and processing code, and the user interface."
      },
      {
        "category": "Visualization",
        "detail": "Created the hardware architecture diagrams, circuit schematics, and system workflow diagrams used in the wiki and presentations."
      }
    ],
    "photo": "../assets/team-member/portraits/bowen-xiao.webp",
    "source": {
      "file": "肖博文_Team_Member_Contribution.docx",
      "rawName": "Bowen Xiao (肖博文)",
      "rawRole": "hardware"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "Hardware/肖博文.jpg",
      "status": "filename-match",
      "cropPixels": [
        1580,
        0,
        4780,
        4000
      ],
      "originalSha256": "c3c889f5428d52b5428ea0971f471174d8f7d71e5c5a775905324e84ba7217c7"
    }
  },
  {
    "id": "qianwen-luo",
    "name": "Qianwen Luo",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "Shining yet not dazzling; still waters run deep.",
    "introduction": "Hi everyone, I'm Qianwen Luo from the School of Public Health at Jilin University. This is my first time participating in the iGEM competition. As a member of the art and design team, my main responsibilities are optimizing the visual effects of our Wiki and creating team merchandise. I hope to convey our team's spirit and project philosophy through creative cultural products and merchandise. I'm grateful for all the help and warmth I've received along the way. I feel truly lucky to be able to move forward and grow together with a group of like-minded teammates. We'd love for you to check out our team and project — stay tuned! Let's go!",
    "generalTasks": [
      "3",
      "6",
      "7",
      "13"
    ],
    "contributionCategories": [
      "Background Research",
      "Visualization",
      "Writing",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Collect and review the Wiki layouts, visual styles, video presentations, and science communication materials of outstanding iGEM teams at home and abroad. Compare the visual logic of top entries to provide references and creative inspiration for this project."
      },
      {
        "category": "Visualization",
        "detail": "Develop a Wiki-appropriate style, contribute to the Wiki homepage, create graphics, and unify the visual tone. Design team uniforms and other merchandise, produce images and videos, and assist other teams with graphic materials."
      },
      {
        "category": "Writing",
        "detail": "Contribute to the narrative design and framework of the Wiki homepage, help create the script for the presentation video, and refine shot arrangement and storytelling in line with the overall visual style."
      },
      {
        "category": "Public Engagement",
        "detail": "Actively take part in offline science communication activities, including fun science classes and knowledge-sharing sessions at special education schools. Through accessible explanations and interactive experiences, spread synthetic biology knowledge to the public."
      }
    ],
    "photo": "../assets/team-member/portraits/qianwen-luo.webp",
    "source": {
      "file": "美工 骆茜雯.docx",
      "rawName": "Qianwen Luo",
      "rawRole": "Visual Designer"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "美工/骆茜雯.png",
      "status": "filename-match",
      "cropPixels": [
        0,
        328,
        2730,
        3740
      ],
      "originalSha256": "d5d79c3882dda0960b6d1f3c4a0c149b62ff3e58b0d3c864478b9b587693b45c"
    }
  },
  {
    "id": "wenqi-ai",
    "name": "Wenqi Ai",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "Design gives science a voice. I strive to bridge the gap between complex biology and public understanding through visual storytelling.",
    "introduction": "Hi, I'm Wenqi Ai, a 2023 undergraduate student from the School of Public Health at Jilin University, majoring in Preventive Medicine. I serve as a Designer in the iGEM team. I am deeply passionate about visualizing scientific concepts and public health messages through creative and unified designs, aiming to bridge the gap between complex biology and public understanding. I look forward to growing together with everyone in the iGEM community.",
    "generalTasks": [
      "1",
      "6",
      "7",
      "13"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Visualization",
      "Writing",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Developed the unified visual identity system for the team, integrating team characteristics and project principles (like PCR technology) into the design concepts. Brainstormed and expanded the Renaissance narrative for the mascot."
      },
      {
        "category": "Visualization",
        "detail": "Led the graphic design of the team logo, flags, mascot \"Bai Xiaoze,\" emoticons, postcards, stickers, and posters. Redesigned the mascot in a Renaissance oil-painting style, and participated in storyboarding and video editing for the promotion video. Handled visual modifications, layout, and PDF design for the Wiki."
      },
      {
        "category": "Writing",
        "detail": "Contributed to the layout design, image selection, and copywriting for 11 WeChat official account articles covering maternal health, child science popularization, and campus activities. Participated in editing and rewriting the Wiki Chapter 2 script to enhance interactivity."
      },
      {
        "category": "Public Engagement",
        "detail": "Designed activity posters and offline materials for diverse audiences (e. g., maternal and child health, respiratory health). Supported the translation of complex scientific concepts into easy-to-understand visual content for broader community outreach."
      }
    ],
    "photo": "../assets/team-member/portraits/wenqi-ai.webp",
    "source": {
      "file": "美工组 艾文琦(1).docx",
      "rawName": "Wenqi Ai",
      "rawRole": "Designer"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "美工/艾文琦.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        378,
        3599,
        4877
      ],
      "originalSha256": "8bc99dcf2a9978ab39d3f8576eb9ce5cdf2850cfe83bfb8a31c92875a65b7584"
    }
  },
  {
    "id": "qianwen-wang",
    "name": "Qianwen Wang",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "Progress comes not from one mind, but from many hands working toward shared good.",
    "introduction": "Hello everybody. I’m Qianwen Wang from the School of Public Health, Jilin University. In our iGEM team, I am mainly responsible for artwork and visual design. During the competition, I closely cooperated with wet-lab and dry-lab teammates. I combined our synthetic-biology project with real-world public-health scenarios and adopted a distinctive design style to polish and highlight our project. I’m grateful for all teammates’ devotion and really enjoy working together with them.",
    "generalTasks": [
      "6",
      "7",
      "13"
    ],
    "contributionCategories": [
      "Visualization",
      "Writing",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Visualization",
        "detail": "Designed mascot-themed merchandise and emoji packs, created team uniforms, and assisted in revising the team flag, logo and Wiki pages. Took the lead in producing the promotion video. Searched and provided project-related image materials for other teammates’ design work."
      },
      {
        "category": "Writing",
        "detail": "Assisted in drafting the basic design outline for the promotion video, and helped revise text content on team Wiki webpages."
      },
      {
        "category": "Public Engagement",
        "detail": "Actively took part in public-oriented science-popularization activities. We promoted our project and shared health knowledge at nursing homes and maternal-and-child health centers. Coordinated design-related tasks with university teams, including collaborating with Tsinghua University on the special modified mod for Plants vs. Zombies."
      }
    ],
    "photo": "../assets/team-member/portraits/qianwen-wang.webp",
    "source": {
      "file": "美工组 王芊雯.docx",
      "rawName": "Qianwen Wang",
      "rawRole": "Designer"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "美工/王芊雯.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        399,
        3671,
        4988
      ],
      "originalSha256": "43f9041e318550e5609a0b0d60751ff7301850b4ab9885e813c3019c55c2a4e2"
    }
  },
  {
    "id": "jiale-zhang",
    "name": "Jiale Zhang",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "All creation starts with a bold try.",
    "introduction": "Hi everyone. I am Jiale Zhang from the School of Public Health, Jilin University, majoring in radiological medicine. This is my first year participating in iGEM, and I serve as the team designer. I am responsible for the full range of visual deliverables of our project. It is a valuable experience to translate our scientific ideas into clear, intuitive visual works, and I enjoy collaborating with all teammates along the way.",
    "generalTasks": [
      "2",
      "3",
      "9",
      "13"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Background Research",
      "Public Engagement",
      "Visualization"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Participated in brainstorming sessions for the project's visual identity, and proposed style directions for core visual assets including logo, team uniform and the wiki visual system."
      },
      {
        "category": "Background Research",
        "detail": "Investigated visual design standards and classic wiki layouts of high-quality iGEM teams, sorted out reference materials to support the construction of our team's visual system."
      },
      {
        "category": "Public Engagement",
        "detail": "Designed promotional materials such as brochures for public welfare outreach activities, and participated in the on-site execution of these events."
      },
      {
        "category": "Visualization",
        "detail": "Took charge of most of the project's visual deliverables, including wiki homepage design, interaction design, page animations and loading animations, team uniform and flag design, presentation video production, peripheral products, and model diagrams for the HP section. Also completed logo draft design and custom emoji assets for the team."
      }
    ],
    "photo": "../assets/team-member/portraits/jiale-zhang.webp",
    "source": {
      "file": "美工组张家乐(1).doc",
      "rawName": "Jiale Zhang",
      "rawRole": "Designer"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "美工/张家乐.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        173,
        1280,
        1773
      ],
      "originalSha256": "f86582bdeb5739b7d1e26e83eb8c3fd924695ae07b06c29c33f68c88b31671af"
    }
  },
  {
    "id": "chen-xing",
    "name": "Chen Xing",
    "role": "Visual Design",
    "groups": [
      "Visual Design"
    ],
    "quote": "Art comes from life.",
    "introduction": "I’m Chen Xing from the School of Public Health. Serving as the designer of our iGEM team, I take charge of all visual outputs for this project. I am devoted to converting complicated synthetic-biology information into clear and appealing visual works. This competition offers me a precious chance to combine design with public health research. I really appreciate the teamwork with all teammates and have learned a lot throughout this journey.",
    "generalTasks": [
      "2",
      "6",
      "7",
      "8",
      "11",
      "13"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Visualization",
      "Writing",
      "Safety",
      "Project Administration",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Took part in brainstorming the visual style of our Wiki, team logo and promotional posters, and confirmed the unified visual tone for our whole project."
      },
      {
        "category": "Visualization",
        "detail": "Designed the team logo, Wiki graphic elements, research workflow diagrams, data illustrations and presentation slides; completed graphic assets for videos and popular-science materials."
      },
      {
        "category": "Writing",
        "detail": "Reviewed and adjusted text layout on Wiki pages, optimized text-graphic matching to enhance the readability of public‑health-related scientific content."
      },
      {
        "category": "Safety",
        "detail": "Checked all visual materials to make sure images and descriptions comply with iGEM safety standards, removing potentially misleading unsafe information."
      },
      {
        "category": "Project Administration",
        "detail": "Communicated with teammates to collect design requirements, sorted design files and resources, and delivered finished artworks according to project milestones."
      },
      {
        "category": "Public Engagement",
        "detail": "Created visual posters and infographics for science-popularization activities, helping the public better understand our public-health-oriented project."
      }
    ],
    "photo": "../assets/team-member/portraits/chen-xing.webp",
    "source": {
      "file": "邢辰Team Member Contribution.docx",
      "rawName": "Chen Xing",
      "rawRole": "Designer"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "美工/邢辰.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        287,
        2731,
        3700
      ],
      "originalSha256": "439fbcb61441fa8bffc26c4ace7cc681636a47780abba6e85cc99e10d91b9db7"
    }
  },
  {
    "id": "luozhao-wang",
    "name": "Luozhao Wang",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Every time you fall is a chance to get back up.",
    "introduction": "Hi everyone. I'm Wang Luozhao from the School of Public Health at Jilin University. I'm really happy to join iGEM as an advisor. I believe this will be a valuable learning experience, and I also hope to contribute to the team. Alone you go fast, but together you go far. I look forward to making progress with my teammates, and I also hope to learn and grow together with other teams in the iGEM community.",
    "generalTasks": [
      "1",
      "3",
      "9",
      "11"
    ],
    "contributionCategories": [
      "Background Research",
      "Analysis",
      "Data Curation",
      "Project Administration",
      "Scientific Support"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Conduct literature reviews and background research to clarify the scientific context, identify existing approaches and their limitations, and help the team define the significance and objectives of the project.2. Data"
      },
      {
        "category": "Analysis",
        "detail": "Organize and analyze experimental and research data, identify meaningful trends and relationships, and provide evidence-based interpretations to support project development and decision-making."
      },
      {
        "category": "Data Curation",
        "detail": "Collect, organize, verify, and standardize relevant scientific data and literature. I also help ensure that the sources of key information are properly documented and that the data used by the team are reliable and traceable."
      },
      {
        "category": "Project Administration",
        "detail": "Assist with project planning, task coordination, documentation, and progress tracking. I help maintain communication among team members and ensure that research, experimental work, and project documentation progress according to the team's timeline."
      },
      {
        "category": "Scientific Support",
        "detail": "Provide feedback on experimental design, interpretation of results, and project direction when needed, and help the team identify potential scientific or organizational issues at an early stage."
      }
    ],
    "photo": "../assets/team-member/portraits/luozhao-wang.webp",
    "source": {
      "file": "advisor王洛钊.docx",
      "rawName": "Luozhao Wang",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/王洛钊ad.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        211,
        1280,
        1811
      ],
      "originalSha256": "3fbf8e9ad08efa34aefcdd0366c3f16ccbe438634761316b1df9761eb7303a90"
    }
  },
  {
    "id": "lanchao-sun",
    "name": "Lanchao Sun",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Good science is driven by curiosity and rigorous thinking.",
    "introduction": "Hi everyone. I am Lanchao Sun from the School of Public Health. As an advisor for this iGEM team, I provide academic guidance for their synthetic-biology project. My research mainly focuses on computational toxicology. I offer suggestions on experimental schemes, data interpretation and project logic, and support teammates to solve research challenges throughout the competition.",
    "generalTasks": [
      "1",
      "2",
      "3",
      "8",
      "11"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Background Research",
      "Safety",
      "Project Administration"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Provided guidance for teammates to interpret experimental and modelling data, assisted in evaluating result reliability and analyzing potential sources of error from the perspective of computational toxicology."
      },
      {
        "category": "Conceptualization",
        "detail": "Offered academic advice on project conception and technical route design, helped revise the overall research framework of this synthetic-biology project combined with toxicological assessment demands."
      },
      {
        "category": "Background Research",
        "detail": "Guided team members to screen and read relevant literature in synthetic biology and toxicology, gave suggestions for sorting out research background and identifying existing research gaps."
      },
      {
        "category": "Safety",
        "detail": "Supervised biosafety compliance, reviewed experimental operation schemes, and gave instructions to ensure all work follows iGEM and institutional safety requirements."
      },
      {
        "category": "Project Administration",
        "detail": "Participated in reviewing project milestones, gave feedback on Wiki and competition materials, coordinated progress and gave suggestions for team problem-solving."
      }
    ],
    "photo": "../assets/team-member/portraits/lanchao-sun.webp",
    "source": {
      "file": "Advisor  孙兰超.docx",
      "rawName": "Lanchao Sun",
      "rawRole": "Advisor）"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/孙兰超（ad）.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        364,
        3467,
        4698
      ],
      "originalSha256": "ca71ea3f2c45f42b234a1e1e773df27f07980ca25e59adda8aba854d7ee87cbf"
    }
  },
  {
    "id": "ziqiao-he",
    "name": "Ziqiao He",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Success is peace of mind, which is a direct result of self-satisfaction in knowing you made the effort to become the best of which you are capable.",
    "introduction": "Hi everyone. I am Ziqiao He from the School of Public Health at Jilin University. This year is my first time participating in iGEM and serving as an advisor. My research focus is environmental toxicology, exploring the harmful effects, mechanisms and risks of environmental pollutants and other exogenous factors on organisms and ecosystems. I also use computational toxicology to predict toxicity, exposure and risks through models, algorithms and molecular simulations, providing scientific basis for environmental health risk assessment and control. I look forward to learning, communicating and constantly improving together with every member, and seeing you at the Jamboree!",
    "generalTasks": [
      "3",
      "4",
      "7",
      "8",
      "13"
    ],
    "contributionCategories": [
      "Background Research",
      "Investigation",
      "Writing",
      "Safety",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Guided the team’s literature review and conceptual framing, helping identify key knowledge gaps and define the rationale that shaped the research design and technical approach."
      },
      {
        "category": "Investigation",
        "detail": "Building on this foundation, advised on research design, technical roadmap, experimental documentation, data organization and analysis, candidate comparison, and iterative refinement, supporting interpretation of results and validation of the approach."
      },
      {
        "category": "Writing",
        "detail": "Reviewed and edited the team’s wiki, judging materials, evaluation forms, application documents, data visualizations, workflow diagrams, and presentation scripts, ensuring coherence across background research, investigation, and safety documentation."
      },
      {
        "category": "Safety",
        "detail": "Provided oversight on experimental standardization, biosafety documentation, and responsible conduct, helping integrate safe and standardized practices into the procedures described in the investigation and written deliverables."
      },
      {
        "category": "Public Engagement",
        "detail": "Supported project presentations, defense preparation, and outreach activities, helping the team communicate the work clearly and responsibly and connect it to broader scientific and societal considerations."
      }
    ],
    "photo": "../assets/team-member/portraits/ziqiao-he.webp",
    "source": {
      "file": "Advisor-何梓侨.docx",
      "rawName": "Ziqiao He",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/何梓侨（ad）.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        384,
        3200,
        4384
      ],
      "originalSha256": "5ba26970c80562333994be39111ff676273eeaad75457f3d73c2f28d85adfa71"
    }
  },
  {
    "id": "hanyu-wang",
    "name": "Hanyu Wang",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "What we seek shapes what we see.",
    "introduction": "Hi everyone. I am Hanyu Wang from the School of Public Health at Jilin University, and I am very happy to serve as an Advisor for our iGEM team this year. I am glad to have the opportunity to support the team with my research experience, discuss ideas with our team members, and work together to improve the project throughout this journey. I would like to express my sincere appreciation to our instructors for their guidance and support, as well as to all of our team members for their creativity, dedication, and hard work. Being part of the team has also been a valuable learning experience for me. I look forward to continuing to learn, explore, and grow together with everyone in the iGEM community.",
    "generalTasks": [
      "1",
      "2",
      "4",
      "8"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Investigation",
      "Visualization"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Guided organization, interpretation and presentation of experimental and modeling data. Reviewed primer–crRNA candidate comparisons, aided interpretation of performance trends and evaluation of the detection system."
      },
      {
        "category": "Conceptualization",
        "detail": "Advised on research design and technical roadmap, including RPA primer–crRNA co-design, AI-aided performance prediction, and dry-lab modeling coupled with wet-lab validation."
      },
      {
        "category": "Investigation",
        "detail": "Assisted literature review and research planning for RPA–CRISPR diagnostics, nucleic acid probe design and AI-enabled biosensing tools. Provided input on experimental recording, result analysis and study optimization."
      },
      {
        "category": "Visualization",
        "detail": "Advised visual design for experimental data, AI pipelines and research frameworks; revised figures, workflow schematics and slides to enhance scientific readability, logic and visual consistency."
      }
    ],
    "photo": "../assets/team-member/portraits/hanyu-wang.webp",
    "source": {
      "file": "Advisor王晗宇.doc",
      "rawName": "Hanyu Wang",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/王晗宇ad.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        328,
        2564,
        3533
      ],
      "originalSha256": "c27d9dd03b309d8d9cfb3af6837709e5ae9109ee65526d63ab0c76629b1d248b"
    }
  },
  {
    "id": "feiyue-wang",
    "name": "Feiyue Wang",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Stay confident, stay curious, and keep moving forward—every step you take writes your own story.",
    "introduction": "Hi everyone. I am Feiyue Wang from the School of Public Health at Jilin University, majoring in Occupational and Environmental Health. This year marks my first iGEM journey as an advisor. This role is both a valuable experience and a meaningful responsibility. I would like to express my sincere gratitude to our instructors for their guidance and to all teammates for their dedication and collaboration. I am glad to support our team in project design, data analysis, safety, and writing. I look forward to learning, growing, and making progress with the iGEM community. See you at the Jamboree!",
    "generalTasks": [
      "1",
      "2",
      "3",
      "8",
      "11",
      "13"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Background Research",
      "Safety",
      "Project Administration",
      "Public Engagement"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Guided the team in organizing and analyzing experimental data and model outputs, comparing candidate primer–crRNA combinations and optimized reaction parameters, and interpreting the performance of the RPA-CRISPR/Cas12a detection system."
      },
      {
        "category": "Conceptualization",
        "detail": "Contributed to the research design and technical roadmap, including the integration of DNABERT-6-based sequence screening, molecular docking/molecular dynamics simulation, enzyme kinetics modeling, and wet-lab validation into a spiral closed-loop optimization framework for portable multiplex respiratory pathogen detection."
      },
      {
        "category": "Background Research",
        "detail": "Provided guidance on literature review and study rationale, covering respiratory pathogens, RPA, CRISPR/Cas12a, DNABERT, molecular simulation, biosafety guidelines, and point-of-care testing."
      },
      {
        "category": "Safety",
        "detail": "Advised on biosafety documentation, experimental standardization, and compliance with institutional and iGEM safety requirements, supporting safe and standardized implementation of experimental and testing procedures."
      },
      {
        "category": "Project Administration",
        "detail": "Helped coordinate project planning, milestones, documentation, version control, evaluation forms, and application materials, and supported communication among team members; also reviewed and edited wiki, reports, and presentation materials."
      },
      {
        "category": "Public Engagement",
        "detail": "Guided project presentations and defense preparation, highlighting the potential of the platform for rapid on-site detection of respiratory pathogens and its public health significance."
      }
    ],
    "photo": "../assets/team-member/portraits/feiyue-wang.webp",
    "source": {
      "file": "20260924_王飞跃.docx",
      "rawName": "Feiyue Wang",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/王飞跃ad.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        145,
        1280,
        1745
      ],
      "originalSha256": "7e001b0c675bf408fe3f2829029129eb5dd556e536a42e16f00939a9775989b5"
    }
  },
  {
    "id": "sen-liang",
    "name": "Sen Liang",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Rigorous science begins with careful thinking and grows through collaboration, exploration, and continuous improvement.",
    "introduction": "I am Liang Sen, a PhD candidate from the School of Public Health at Jilin University. My research focuses on pathogen detection technologies, particularly the development and application of methods for detecting pathogenic microorganisms. As an advisor to the team, I assisted students with experimental work, coordinated research resources and experimental platforms, and provided guidance on modeling. I also supported the integration of experimental and computational approaches throughout the development of the respiratory pathogen detection project.",
    "generalTasks": [
      "1",
      "2",
      "4",
      "11",
      "15"
    ],
    "contributionCategories": [
      "Analysis",
      "Conceptualization",
      "Investigation",
      "Project Administration",
      "Hardware"
    ],
    "tasks": [
      {
        "category": "Analysis",
        "detail": "Provided guidance on the development and evaluation of the AI-assisted modeling approach used for primer design. Assisted the team in interpreting modeling results and considering their applicability to the RPA-CRISPR detection workflow."
      },
      {
        "category": "Conceptualization",
        "detail": "Provided suggestions on the technical implementation of the project, particularly regarding the integration of AI-assisted primer design with the RPA-CRISPR detection system. Offered guidance on connecting computational design with subsequent experimental validation."
      },
      {
        "category": "Investigation",
        "detail": "Assisted students in conducting and troubleshooting experiments related to the RPA-CRISPR-based respiratory pathogen detection system. Provided guidance during experimental implementation and helped the team improve the reliability and feasibility of experimental procedures."
      },
      {
        "category": "Project Administration",
        "detail": "Coordinated research resources, experimental platforms, and other technical support required for the project. Helped facilitate access to laboratory facilities and supported the team in carrying out experimental validation and related project activities efficiently."
      },
      {
        "category": "Hardware",
        "detail": "Provided guidance on the design and practical implementation of the detection device developed for the respiratory pathogen detection system. Offered suggestions on its functional integration with the RPA-CRISPR workflow and supported the team in improving the usability and feasibility of the device for on-site detection applications."
      }
    ],
    "photo": "../assets/team-member/portraits/sen-liang.webp",
    "source": {
      "file": "梁森.docx",
      "rawName": "Sen Liang",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/梁森ad.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        173,
        1280,
        1773
      ],
      "originalSha256": "47f6f094b2a4ef4c8383de4ef700d366acbbbfc8f70a57dc782af8bd4d9ea6d3"
    }
  },
  {
    "id": "wang-pengtao",
    "name": "Wang Pengtao",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "The best way to predict the future is to create it.",
    "introduction": "I am from the School of Public Health, Jilin University. As a postgraduate majoring in Occupational and Environmental Health, my research focuses on rapid detection technologies for foodborne pathogens. I aim to develop convenient and sensitive detection methods, which can help improve food safety supervision and reduce the risk of foodborne diseases.",
    "generalTasks": [
      "3",
      "4",
      "7",
      "8"
    ],
    "contributionCategories": [
      "Background Research",
      "Investigation",
      "Writing",
      "Safety"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Reviewed peer-reviewed papers on foodborne pathogen detection and food safety guidelines to lay the theoretical foundation for our rapid detection system."
      },
      {
        "category": "Investigation",
        "detail": "Conducted laboratory experiments for foodborne bacteria detection and collected raw experimental data to verify the performance of our testing method."
      },
      {
        "category": "Writing",
        "detail": "Drafted, revised and edited Wiki pages and project documents, organizing experimental results and research background for public presentation."
      },
      {
        "category": "Safety",
        "detail": "Followed laboratory safety protocols strictly, ensured all experimental operations comply with safety requirements of Jilin University, iGEM and relevant national regulations."
      }
    ],
    "photo": "../assets/team-member/portraits/wang-pengtao.webp",
    "source": {
      "file": "王鹏涛-Team Member Contribution.docx",
      "rawName": "Wang Pengtao",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/王鹏涛（ad）.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        173,
        1280,
        1773
      ],
      "originalSha256": "b3bef730eec1b9e51b4ba95cb071189c512fa101a62b36fb65049edb9e3ef6e5"
    }
  },
  {
    "id": "chen-boyuan",
    "name": "Chen Boyuan",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "The surest way to foresee the future is to shape it.",
    "introduction": "I am a postgraduate student at the School of Public Health, Jilin University, majoring in Occupational and Environmental Health. My research focuses on rapid detection technologies for foodborne pathogens. I aim to develop convenient and sensitive detection methods that can help strengthen food safety supervision and reduce the risk of foodborne diseases.",
    "generalTasks": [
      "3",
      "4",
      "7",
      "8"
    ],
    "contributionCategories": [
      "Background Research",
      "Investigation",
      "Writing",
      "Safety"
    ],
    "tasks": [
      {
        "category": "Background Research",
        "detail": "Reviewed peer-reviewed papers on foodborne pathogen detection and food safety guidelines to lay the theoretical foundation for our rapid detection system."
      },
      {
        "category": "Investigation",
        "detail": "Conducted laboratory experiments for foodborne bacteria detection and collected raw experimental data to verify the performance of our testing method."
      },
      {
        "category": "Writing",
        "detail": "Drafted, revised and edited Wiki pages and project documents, organizing experimental results and research background for public presentation."
      },
      {
        "category": "Safety",
        "detail": "Followed laboratory safety protocols strictly, ensured all experimental operations comply with safety requirements of Jilin University, iGEM and relevant national regulations."
      }
    ],
    "photo": "../assets/team-member/portraits/chen-boyuan.webp",
    "source": {
      "file": "陈博远-Team Member Contribution(1).docx",
      "rawName": "Chen Boyuan",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/陈博远（ad）.jpg",
      "status": "filename-match",
      "cropPixels": [
        0,
        192,
        1280,
        1792
      ],
      "originalSha256": "fd6f4029dd640e08c179066df8b73c786b5aa3900dd748ee3a83a276a468db70"
    }
  },
  {
    "id": "ziyun-ma",
    "name": "Ziyun Ma",
    "role": "Advisor",
    "groups": [
      "Advisors"
    ],
    "quote": "Where the will reaches, no distance is beyond bounds.",
    "introduction": "I am Ziyun Ma. As a postgraduate of the School of Public Health, Jilin University, my research focuses on hygienic detection, especially rapid bacterial screening technologies. As the project advisor, I share my professional technical experience with the team. I admire the whole team’s passion and persistence in this exploration. I look forward to discovering new possibilities together and delivering useful outcomes.",
    "generalTasks": [
      "1",
      "2",
      "3",
      "4",
      "9"
    ],
    "contributionCategories": [
      "Conceptualization",
      "Investigation",
      "Analysis",
      "Background Research",
      "Data Curation"
    ],
    "tasks": [
      {
        "category": "Conceptualization",
        "detail": "Developed partial experimental strategies and optimized testing workflows for the bacterial detection system, contributing partial technical ideas to the team."
      },
      {
        "category": "Investigation",
        "detail": "Performed part of the wet-lab experiments and collected raw experimental data to verify the performance of our detection method. The experimental operations and results were shared with team members for reference."
      },
      {
        "category": "Analysis",
        "detail": "Processed experimental datasets, analyzed test signals and generated corresponding graphs for data visualization, and shared analytical logic with the team."
      },
      {
        "category": "Background Research",
        "detail": "Conducted literature retrieval to validate feasibility and support the rationality of experimental design."
      },
      {
        "category": "Data Curation",
        "detail": "Sorted, cleaned and annotated raw experimental data, organizing datasets for team sharing and future reference."
      }
    ],
    "photo": "../assets/team-member/portraits/ziyun-ma.webp",
    "source": {
      "file": "马梓云.docx",
      "rawName": "Ziyun Ma",
      "rawRole": "Advisor"
    },
    "dataIssues": [],
    "photoSource": {
      "file": "ad/马子云ad.jpg",
      "status": "user-confirmed-alias",
      "cropPixels": [
        0,
        230,
        1280,
        1830
      ],
      "originalSha256": "9bf8f49f82689d0b6c8590495c3f70f66dd0d44c7a2cb20e5389ae9a0abf62c3",
      "aliasConfirmation": {
        "authority": "human user",
        "date": "2026-10-03",
        "answer": "两张都对应原成员"
      }
    }
  }
]

export const memberDataIssues = [
  {
    "memberId": "liuyu-yang",
    "memberName": "Liuyu Yang",
    "type": "identity-conflict",
    "field": "name",
    "sourceValue": "Jingyi Kang",
    "resolution": "Display name follows the source filename: Liuyu Yang."
  },
  {
    "memberId": "liuyu-yang",
    "memberName": "Liuyu Yang",
    "type": "field-mismatch",
    "field": "quote",
    "sourceValue": "The Quote field contains a self-introduction and no separate quote.",
    "resolution": "The text is retained as the introduction; quote remains empty."
  },
  {
    "memberId": "zhiyuan-jin",
    "memberName": "Zhiyuan Jin",
    "type": "role-normalization",
    "field": "role",
    "sourceValue": "Member",
    "resolution": "Normalized to Wet Lab Leader from the filename and introduction."
  },
  {
    "memberId": "mo-jin",
    "memberName": "Mo Jin",
    "type": "name-order-conflict",
    "field": "name",
    "sourceValue": "Team Member says 'Mo Jin'; introduction says 'Jin Mo'.",
    "resolution": "Display name follows the Team Member field: Mo Jin."
  },
  {
    "memberId": "haoyang-liu",
    "memberName": "Haoyang Liu",
    "type": "field-mismatch",
    "field": "quote",
    "sourceValue": "The Quote field contains an introduction and no separate quote.",
    "resolution": "The text is retained as the introduction; quote remains empty."
  },
  {
    "memberId": "haoyang-liu",
    "memberName": "Haoyang Liu",
    "type": "role-normalization",
    "field": "role",
    "sourceValue": "Member",
    "resolution": "Normalized to Dry Lab from software, model, and data contributions."
  }
]

// Faculty: English display names use pinyin; raw Chinese names and source roles remain recorded.
export const teamFaculty = [
  {
    "id": "pi-song-xiuling",
    "name": "Xiuling Song",
    "role": "PI",
    "groups": [
      "PI"
    ],
    "photo": "../assets/team-member/portraits/pi-song-xiuling.webp",
    "source": {
      "file": "PI/宋秀玲（pi）.jpg",
      "rawName": "宋秀玲",
      "rawRole": "PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "宋秀玲",
      "preferredEnglishSpellingVerified": false
    },
    "framingPhoto": "../assets/team-member/portraits/pi-song-xiuling-source.jpg"
  },
  {
    "id": "pi-pang-bo",
    "name": "Bo Pang",
    "role": "PI",
    "groups": [
      "PI"
    ],
    "photo": "../assets/team-member/portraits/pi-pang-bo.webp",
    "source": {
      "file": "PI/庞博（pi）.jpg",
      "rawName": "庞博",
      "rawRole": "PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "庞博",
      "preferredEnglishSpellingVerified": false
    }
  },
  {
    "id": "pi-li-jinhua",
    "name": "Jinhua Li",
    "role": "PI",
    "groups": [
      "PI"
    ],
    "photo": "../assets/team-member/portraits/pi-li-jinhua.webp",
    "source": {
      "file": "PI/李金华（pi）.jpg",
      "rawName": "李金华",
      "rawRole": "PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "李金华",
      "preferredEnglishSpellingVerified": false
    }
  },
  {
    "id": "secondary-pi-wang-juan",
    "name": "Juan Wang",
    "role": "Secondary PI",
    "groups": [
      "Secondary PI"
    ],
    "photo": "../assets/team-member/portraits/secondary-pi-wang-juan.webp",
    "source": {
      "file": "Secondary PI/王娟（secondary Pi.jpg",
      "rawName": "王娟",
      "rawRole": "Secondary PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "王娟",
      "preferredEnglishSpellingVerified": false
    }
  },
  {
    "id": "secondary-pi-su-guofan",
    "name": "Guofan Su",
    "role": "Secondary PI",
    "groups": [
      "Secondary PI"
    ],
    "photo": "../assets/team-member/portraits/secondary-pi-su-guofan.webp",
    "source": {
      "file": "Secondary PI/苏国范（secondary pi）.jpg",
      "rawName": "苏国范",
      "rawRole": "Secondary PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "苏国范",
      "preferredEnglishSpellingVerified": false
    }
  },
  {
    "id": "secondary-pi-zhao-chao",
    "name": "Chao Zhao",
    "role": "Secondary PI",
    "groups": [
      "Secondary PI"
    ],
    "photo": "../assets/team-member/portraits/secondary-pi-zhao-chao.webp",
    "source": {
      "file": "Secondary PI/赵超（secondary Pi）.jpg",
      "rawName": "赵超",
      "rawRole": "Secondary PI"
    },
    "introduction": "",
    "quote": "",
    "generalTasks": [],
    "contributionCategories": [],
    "tasks": [],
    "dataIssues": [],
    "profileStatus": "basic-information-only",
    "missingFields": [
      "Verified English name",
      "Institution and title",
      "Introduction",
      "Quote",
      "Contributions"
    ],
    "nameSource": {
      "method": "Pinyin romanization",
      "rawName": "赵超",
      "preferredEnglishSpellingVerified": false
    },
    "framingPhoto": "../assets/team-member/portraits/secondary-pi-zhao-chao-source.jpg"
  }
]
