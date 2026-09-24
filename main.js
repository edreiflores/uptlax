/* ==========================================================================
   SISTEMA DE BECAS UNIPOL TLAXCALA - MAIN JAVASCRIPT LOGIC
   Universidad Politécnica de Tlaxcala (https://unipoltlax.edu.mx)
   ========================================================================== */

// Initial Database of Scholarships
const becasData = [
    {
        id: "excelencia",
        category: "excelencia",
        title: "Beca Institucional de Excelencia Académica",
        badge: "Abierta • Semestral",
        icon: "🏆",
        benefit: "100% Exención de Colegiatura + $3,500 MXN / Cuatrimestre",
        minPromedio: 9.5,
        reqs: ["Promedio mínimo de 9.50", "Ser alumno regular sin extraordinarios", "Cuatrimestres de 2° a 10°", "Carta de conducta expedida por tutor"],
        desc: "Destinada a estudiantes con alto rendimiento académico y constancia sobresaliente en sus estudios de ingeniería."
    },
    {
        id: "manutencion",
        category: "manutencion",
        title: "Beca de Manutención y Aprovechamiento",
        badge: "Abierta • Apoyo Mensual",
        icon: "💳",
        benefit: "$2,500 MXN Mensuales durante el ciclo lectivo",
        minPromedio: 8.5,
        reqs: ["Promedio mínimo de 8.50", "Estudio socioeconómico familiar", "No contar con otro apoyo federal incompatible", "Kárdex oficial vigente"],
        desc: "Apoyo económico mensual para cubrir gastos de alimentación, materiales de estudio y traslados universitarios."
    },
    {
        id: "socioeconomica",
        category: "manutencion",
        title: "Beca Socioeconómica y Alimenticia UNIPOL",
        badge: "Prioritaria",
        icon: "🍲",
        benefit: "Servicio de Comedor Universitario + Apoyo del 50% en Colegiatura",
        minPromedio: 8.0,
        reqs: ["Promedio mínimo de 8.00", "Ingreso familiar menor a 3 salarios mínimos", "Comprobante de domicilio en Tlaxcala", "Entrevista socioeconómica"],
        desc: "Dirigida a jóvenes en situación de vulnerabilidad económica para evitar la deserción escolar en la UPTx."
    },
    {
        id: "deporte",
        category: "deporte",
        title: "Beca Deportiva y Representación Cultural",
        badge: "Talento UPTx",
        icon: "🥇",
        benefit: "50% Exención de Pago + Uniformes Institucionales",
        minPromedio: 8.2,
        reqs: ["Pertenecer a selectivo deportivo o taller cultural", "Promedio académico de 8.2", "Carta de aval por la Dirección de Deportes UPTx"],
        desc: "Reconoce y fomenta a atletas de alto rendimiento y talentos artísticos que representan a la UPTx en torneos nacionales."
    },
    {
        id: "santander",
        category: "convenio",
        title: "Beca Santander - UNIPOL Movilidad",
        badge: "Convenio Externo",
        icon: "🌐",
        benefit: "$5,000 MXN Pago Único de Estímulo",
        minPromedio: 8.8,
        reqs: ["Estar inscrito a partir del 4° cuatrimestre", "Avance crediticio > 45%", "Inscripción previa en la plataforma Becas Santander"],
        desc: "Programa conjunto entre Banco Santander y la UPTx para impulsar la permanencia y proyectos de innovación."
    },
    {
        id: "telmex",
        category: "convenio",
        title: "Beca Fundación Telmex - Telcel",
        badge: "Nivel Nacional",
        icon: "📱",
        benefit: "$3,000 MXN Mensuales + Laptop Institucional con Internet",
        minPromedio: 9.0,
        reqs: ["Promedio mínimo de 9.0", "Participación en actividades de labor social", "Aprobar evaluación psicométrica de la Fundación"],
        desc: "Exclusiva para estudiantes líderes con compromiso social y promedio destacado en ingenierías."
    }
];

// Initial Seed of Applications Database in localStorage
const initialApplications = [
    {
        folio: "UPTX-BEC-2026-9481",
        nombre: "Alondra Ramos Morales",
        matricula: "202403152",
        carrera: "Ingeniería Mecatrónica",
        cuatri: "4",
        promedio: 9.65,
        beca: "Beca de Excelencia Académica Institucional",
        ingreso: 6500,
        municipio: "Tepeyanco, Tlaxcala",
        status: "APROBADA",
        fecha: "12/09/2026",
        observaciones: "Expediente validado al 100%. Padrón aprobado en 1ª Sesión del Comité. Dispersión programada para noviembre."
    },
    {
        folio: "UPTX-BEC-2026-7734",
        nombre: "Carlos Eduardo Tlaxcalteca",
        matricula: "202302819",
        carrera: "Ingeniería en Tecnologías de la Información",
        cuatri: "6",
        promedio: 8.90,
        beca: "Beca de Manutención y Aprovechamiento",
        ingreso: 5200,
        municipio: "Apizaco, Tlaxcala",
        status: "EN VALIDACIÓN",
        fecha: "18/09/2026",
        observaciones: "Documentos digitalizados correctamente. En espera de cotejo con la Coordinación de Servicios Escolares."
    },
    {
        folio: "UPTX-BEC-2026-5120",
        nombre: "Mariana Hernández Pérez",
        matricula: "202401104",
        carrera: "Ingeniería Química",
        cuatri: "3",
        promedio: 9.15,
        beca: "Beca Socioeconómica y Alimenticia",
        ingreso: 4800,
        municipio: "Huamantla, Tlaxcala",
        status: "REVISIÓN COMITÉ",
        fecha: "20/09/2026",
        observaciones: "Candidata preseleccionada para servicio de comedor. Falta dictamen final presupuestal."
    }
];

// Local Storage Helper
function getStoredApplications() {
    const data = localStorage.getItem('unipol_becas_apps');
    if (!data) {
        localStorage.setItem('unipol_becas_apps', JSON.stringify(initialApplications));
        return initialApplications;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return initialApplications;
    }
}

function saveApplications(apps) {
    localStorage.setItem('unipol_becas_apps', JSON.stringify(apps));
}

// Global DOM Ready
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME SWITCHER LOGIC
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('unipol_theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

            if (targetTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            localStorage.setItem('unipol_theme', targetTheme);
        });
    }

    /* ==========================================================================
       2. MOBILE MENU & ACCORDIONS
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navMenu.style.display = navMenu.classList.contains('active') ? 'flex' : '';
        });
    }

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    /* ==========================================================================
       3. BECAS CATALOG RENDERING & FILTERING
       ========================================================================== */
    const becasGrid = document.getElementById('becasGrid');

    function renderBecas(filter = 'all') {
        if (!becasGrid) return;
        becasGrid.innerHTML = '';

        const filtered = filter === 'all'
            ? becasData
            : becasData.filter(b => b.category === filter);

        filtered.forEach(beca => {
            const card = document.createElement('div');
            card.className = 'beca-card';
            card.innerHTML = `
                <div class="beca-card-header">
                    <span class="beca-type-tag">${beca.badge}</span>
                    <h3 class="beca-card-title">${beca.icon} ${beca.title}</h3>
                </div>

                <div class="beca-benefit-box">
                    <div class="benefit-icon">🎁</div>
                    <div class="benefit-info">
                        <small>Beneficio Institucional</small>
                        <strong>${beca.benefit}</strong>
                    </div>
                </div>

                <div class="beca-req-list">
                    ${beca.reqs.map(req => `<div class="beca-req-item">${req}</div>`).join('')}
                </div>

                <div class="beca-card-actions">
                    <button class="btn btn-outline btn-sm w-100 btn-detalles" data-id="${beca.id}">Bases Completas</button>
                    <a href="#solicitar" class="btn btn-primary btn-sm w-100 btn-apply-direct" data-becaname="${beca.title}">Postularme</a>
                </div>
            `;
            becasGrid.appendChild(card);
        });

        // Event Listeners for Details Modal
        document.querySelectorAll('.btn-detalles').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const selected = becasData.find(b => b.id === id);
                if (selected) showBecaModal(selected);
            });
        });

        // Event listeners for direct apply button
        document.querySelectorAll('.btn-apply-direct').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-becaname');
                const sel = document.getElementById('solBecaTipo');
                if (sel) {
                    for (let opt of sel.options) {
                        if (opt.value.includes(name) || name.includes(opt.value)) {
                            opt.selected = true;
                            break;
                        }
                    }
                }
            });
        });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBecas(btn.getAttribute('data-filter'));
        });
    });

    renderBecas();

    /* ==========================================================================
       4. SIMULADOR DE ELEGIBILIDAD LOGIC
       ========================================================================== */
    const simPromedio = document.getElementById('simPromedio');
    const promedioVal = document.getElementById('promedioVal');
    const simuladorForm = document.getElementById('simuladorForm');
    const simuladorResultados = document.getElementById('simuladorResultados');

    if (simPromedio && promedioVal) {
        simPromedio.addEventListener('input', (e) => {
            promedioVal.textContent = parseFloat(e.target.value).toFixed(1);
        });
    }

    if (simuladorForm) {
        simuladorForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const carrera = document.getElementById('simCarrera').value;
            const promedio = parseFloat(simPromedio.value);
            const ingresos = document.getElementById('simIngresos').value;
            const actividades = document.getElementById('simActividades').value;

            // Compute score algorithm
            let score = 50;

            // Promedio weight
            if (promedio >= 9.5) score += 40;
            else if (promedio >= 9.0) score += 30;
            else if (promedio >= 8.5) score += 20;
            else if (promedio >= 8.0) score += 10;

            // Socioeconomic weight
            if (ingresos === 'bajo') score += 10;
            else if (ingresos === 'medio-bajo') score += 8;

            // Extracurricular weight
            if (actividades !== 'ninguna') score += 5;

            if (score > 100) score = 100;

            // Update Circle UI
            const circlePath = document.getElementById('circleScorePath');
            const scoreText = document.getElementById('scoreText');
            const resultTextSummary = document.getElementById('resultTextSummary');
            const recommendedBecasList = document.getElementById('recommendedBecasList');

            if (circlePath && scoreText) {
                circlePath.setAttribute('stroke-dasharray', `${score}, 100`);
                scoreText.textContent = `${score}%`;
            }

            if (resultTextSummary) {
                if (score >= 85) {
                    resultTextSummary.textContent = "¡Excelente candidato! Tienes un perfil altamente elegible para las becas de mayor beneficio de la UPTx.";
                } else if (score >= 70) {
                    resultTextSummary.textContent = "Perfil compatible con becas de Manutención y Apoyo Alimenticio Institucional.";
                } else {
                    resultTextSummary.textContent = "Requieres elevar tu promedio al menos a 8.5 para calificar en la mayoría de convocatorias.";
                }
            }

            // Generate recommended chips
            if (recommendedBecasList) {
                recommendedBecasList.innerHTML = '';
                const recs = [];

                if (promedio >= 9.5) recs.push({ name: 'Beca de Excelencia Académica (100% Exención)', match: '98% Match' });
                if (promedio >= 8.5) recs.push({ name: 'Beca de Manutención ($2,500/mes)', match: '92% Match' });
                if (ingresos === 'bajo' || ingresos === 'medio-bajo') recs.push({ name: 'Beca Socioeconómica y Comedor', match: '95% Match' });
                if (actividades === 'deporte' || actividades === 'cultura') recs.push({ name: 'Beca Deportiva / Cultural UPTx', match: '90% Match' });

                recs.forEach(r => {
                    const div = document.createElement('div');
                    div.className = 'rec-item';
                    div.innerHTML = `<span><strong>${r.name}</strong></span> <span class="rec-score">${r.match}</span>`;
                    recommendedBecasList.appendChild(div);
                });
            }

            simuladorResultados.classList.remove('hidden');
            simuladorResultados.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       5. MULTI-STEP WIZARD FORM (SOLICITAR BECA)
       ========================================================================== */
    const becaForm = document.getElementById('becaForm');
    const wizardPanes = document.querySelectorAll('.wizard-pane');
    const wizardSteps = document.querySelectorAll('.wizard-step');

    function goToStep(stepNum) {
        wizardPanes.forEach(pane => pane.classList.remove('active'));
        wizardSteps.forEach(step => {
            const num = parseInt(step.getAttribute('data-step'));
            if (num === stepNum) {
                step.classList.add('active');
            } else if (num < stepNum) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        const targetPane = document.getElementById(`wizardStep${stepNum}`);
        if (targetPane) targetPane.classList.add('active');
    }

    // Step Nav buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(btn.getAttribute('data-next'));

            // Validate step 1 fields if going to 2
            if (nextStep === 2) {
                const matricula = document.getElementById('solMatricula');
                const curp = document.getElementById('solCurp');
                const nombre = document.getElementById('solNombre');
                const email = document.getElementById('solEmail');
                const promedio = document.getElementById('solPromedio');

                if (!matricula.value || !curp.value || !nombre.value || !email.value || !promedio.value) {
                    alert('Por favor completa todos los campos obligatorios del Paso 1.');
                    return;
                }
            }

            goToStep(nextStep);
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    // File Input labels update
    const fileInputs = ['fileKardex', 'fileIne', 'fileDomicilio', 'fileIngresos'];
    fileInputs.forEach(id => {
        const inp = document.getElementById(id);
        const lbl = document.getElementById(`labelFile${id.replace('file', '')}`);
        const st = document.getElementById(`statusFile${id.replace('file', '')}`);

        if (inp) {
            inp.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const fname = e.target.files[0].name;
                    if (lbl) lbl.textContent = fname.length > 15 ? fname.substring(0, 15) + '...' : fname;
                    if (st) {
                        st.textContent = "✓ Carga Lista";
                        st.classList.add('loaded');
                    }
                }
            });
        }
    });

    // Final Submit Wizard
    if (becaForm) {
        becaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Generate Unique Folio
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const generatedFolio = `UPTX-BEC-2026-${randomNum}`;

            const matricula = document.getElementById('solMatricula').value;
            const nombre = document.getElementById('solNombre').value;
            const carrera = document.getElementById('solCarrera').value;
            const cuatri = document.getElementById('solCuatri').value;
            const promedio = parseFloat(document.getElementById('solPromedio').value);
            const beca = document.getElementById('solBecaTipo').value;
            const ingreso = parseFloat(document.getElementById('solIngreso').value) || 6000;
            const municipio = document.getElementById('solMunicipio').value || "Tlaxcala";

            const newApp = {
                folio: generatedFolio,
                nombre: nombre,
                matricula: matricula,
                carrera: carrera,
                cuatri: cuatri,
                promedio: promedio,
                beca: beca,
                ingreso: ingreso,
                municipio: municipio,
                status: "EN VALIDACIÓN",
                fecha: new Date().toLocaleDateString('es-MX'),
                observaciones: "Solicitud recién ingresada. Expediente en turno para cotejo digital."
            };

            // Save to localStorage
            const apps = getStoredApplications();
            apps.unshift(newApp);
            saveApplications(apps);

            // Update Success UI
            document.getElementById('generatedFolioCode').textContent = generatedFolio;
            document.getElementById('summaryNombre').textContent = nombre;
            document.getElementById('summaryMatricula').textContent = matricula;
            document.getElementById('summaryBeca').textContent = beca;
            document.getElementById('summaryFecha').textContent = newApp.fecha;

            // Refresh Admin Table if initialized
            renderAdminTable();

            // Go to Step 4
            goToStep(4);
        });
    }

    // Action buttons on step 4
    const btnImprimirAcuse = document.getElementById('btnImprimirAcuse');
    if (btnImprimirAcuse) {
        btnImprimirAcuse.addEventListener('click', () => {
            window.print();
        });
    }

    const btnIrARastreo = document.getElementById('btnIrARastreo');
    if (btnIrARastreo) {
        btnIrARastreo.addEventListener('click', () => {
            const folio = document.getElementById('generatedFolioCode').textContent;
            document.getElementById('trackInput').value = folio;
            document.getElementById('btnTrackFolio').click();
            document.getElementById('rastreo').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       6. TRACKER LOGIC (RASTREADOR DE FOLIO)
       ========================================================================== */
    const trackForm = document.getElementById('trackForm');
    const trackResultContainer = document.getElementById('trackResultContainer');

    function searchAndDisplayFolio(query) {
        if (!query) return;

        const apps = getStoredApplications();
        const found = apps.find(a => 
            a.folio.toLowerCase().trim() === query.toLowerCase().trim() ||
            a.matricula.toLowerCase().trim() === query.toLowerCase().trim()
        );

        if (!found) {
            alert(`No se encontró ningún trámite registrado con el folio o matrícula: "${query}".\nPor favor verifica tu información o realiza un nuevo registro.`);
            return;
        }

        // Render Found Details
        document.getElementById('trackNombre').textContent = found.nombre;
        document.getElementById('trackMatricula').textContent = found.matricula;
        document.getElementById('trackCarrera').textContent = found.carrera;
        document.getElementById('trackFolioDisplay').textContent = found.folio;
        document.getElementById('trackObservaciones').textContent = found.observaciones;

        // Avatar Initials
        const initials = found.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        document.getElementById('trackAvatar').textContent = initials;

        // Badge Status Styling
        const badge = document.getElementById('trackBadgeStatus');
        badge.textContent = found.status;
        badge.className = 'badge-status-large';

        if (found.status === 'APROBADA') {
            badge.style.background = 'var(--success-bg)';
            badge.style.color = 'var(--success)';
        } else if (found.status === 'RECHAZADA') {
            badge.style.background = 'var(--danger-bg)';
            badge.style.color = 'var(--danger)';
        } else {
            badge.style.background = 'var(--warning-bg)';
            badge.style.color = 'var(--warning)';
        }

        // Update 5 Timeline Nodes based on Status
        const step1 = document.getElementById('stepNode1');
        const step2 = document.getElementById('stepNode2');
        const step3 = document.getElementById('stepNode3');
        const step4 = document.getElementById('stepNode4');
        const step5 = document.getElementById('stepNode5');

        [step1, step2, step3, step4, step5].forEach(s => {
            s.className = 'timeline-step';
        });

        if (found.status === 'APROBADA') {
            step1.className = 'timeline-step step-done';
            step2.className = 'timeline-step step-done';
            step3.className = 'timeline-step step-done';
            step4.className = 'timeline-step step-done';
            step5.className = 'timeline-step step-done';
        } else if (found.status === 'REVISIÓN COMITÉ') {
            step1.className = 'timeline-step step-done';
            step2.className = 'timeline-step step-done';
            step3.className = 'timeline-step step-done';
            step4.className = 'timeline-step step-active';
        } else { // EN VALIDACIÓN
            step1.className = 'timeline-step step-done';
            step2.className = 'timeline-step step-done';
            step3.className = 'timeline-step step-active';
        }

        trackResultContainer.classList.remove('hidden');
        trackResultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = document.getElementById('trackInput').value;
            searchAndDisplayFolio(inputVal);
        });
    }

    // Sample Folio Badge Clickers
    document.querySelectorAll('.badge-sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const folio = btn.getAttribute('data-folio');
            document.getElementById('trackInput').value = folio;
            searchAndDisplayFolio(folio);
        });
    });

    const quickTrackDemoBtn = document.getElementById('quickTrackDemoBtn');
    if (quickTrackDemoBtn) {
        quickTrackDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const sampleFolio = 'UPTX-BEC-2026-9481';
            document.getElementById('trackInput').value = sampleFolio;
            searchAndDisplayFolio(sampleFolio);
        });
    }

    /* ==========================================================================
       7. ADMIN DASHBOARD (PANEL DEL COMITÉ DE BECAS)
       ========================================================================== */
    const adminTableBody = document.getElementById('adminTableBody');
    const adminSearchInput = document.getElementById('adminSearchInput');
    const adminFilterStatus = document.getElementById('adminFilterStatus');

    function renderAdminTable() {
        if (!adminTableBody) return;
        const apps = getStoredApplications();

        // Metrics update
        const total = apps.length;
        const pending = apps.filter(a => a.status === 'EN VALIDACIÓN' || a.status === 'REVISIÓN COMITÉ').length;
        const approved = apps.filter(a => a.status === 'APROBADA').length;

        document.getElementById('adminTotalCount').textContent = total;
        document.getElementById('adminPendingCount').textContent = pending;
        document.getElementById('adminApprovedCount').textContent = approved;
        document.getElementById('adminBudgetDisplay').textContent = `$${(approved * 25000).toLocaleString('es-MX')} MXN`;

        // Filters
        const query = adminSearchInput ? adminSearchInput.value.toLowerCase() : '';
        const statusFilter = adminFilterStatus ? adminFilterStatus.value : 'all';

        adminTableBody.innerHTML = '';

        const filtered = apps.filter(app => {
            const matchesQuery = app.nombre.toLowerCase().includes(query) ||
                                 app.folio.toLowerCase().includes(query) ||
                                 app.matricula.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            return matchesQuery && matchesStatus;
        });

        if (filtered.length === 0) {
            adminTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No se encontraron registros con los filtros seleccionados.</td></tr>`;
            return;
        }

        filtered.forEach(app => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>
                    <div><strong>${app.nombre}</strong></div>
                    <small class="text-muted">Mat: ${app.matricula}</small>
                </td>
                <td>${app.carrera} <small class="block">(${app.cuatri}° Cuatrimestre)</small></td>
                <td><span class="badge-status in-progress">${app.promedio}</span></td>
                <td><small>${app.beca}</small></td>
                <td>
                    <span class="badge-status ${app.status === 'APROBADA' ? 'approved' : app.status === 'RECHAZADA' ? 'rejected' : 'in-progress'}">
                        ${app.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-action btn-success btn-approve" data-folio="${app.folio}">Aprobar</button>
                    <button class="btn btn-sm btn-action btn-outline btn-reject" data-folio="${app.folio}">Rechazar</button>
                </td>
            `;
            adminTableBody.appendChild(tr);
        });

        // Event listeners for action buttons
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', () => {
                const folio = btn.getAttribute('data-folio');
                updateAppStatus(folio, 'APROBADA', 'Dictamen favorable emitido por el Comité de Becas UNIPOL.');
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', () => {
                const folio = btn.getAttribute('data-folio');
                updateAppStatus(folio, 'RECHAZADA', 'Solicitud rechazada por no cumplir con la documentación o promedio requerido.');
            });
        });
    }

    function updateAppStatus(folio, newStatus, obs) {
        const apps = getStoredApplications();
        const app = apps.find(a => a.folio === folio);
        if (app) {
            app.status = newStatus;
            app.observaciones = obs;
            saveApplications(apps);
            renderAdminTable();
        }
    }

    if (adminSearchInput) adminSearchInput.addEventListener('input', renderAdminTable);
    if (adminFilterStatus) adminFilterStatus.addEventListener('change', renderAdminTable);

    // Seed Demo Data Button
    const btnSeedDemoData = document.getElementById('btnSeedDemoData');
    if (btnSeedDemoData) {
        btnSeedDemoData.addEventListener('click', () => {
            localStorage.setItem('unipol_becas_apps', JSON.stringify(initialApplications));
            renderAdminTable();
            alert('¡Datos de prueba restaurados exitosamente!');
        });
    }

    // Export CSV Button
    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            const apps = getStoredApplications();
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Folio,Nombre,Matricula,Carrera,Cuatrimestre,Promedio,Beca,Estado,Fecha\n";

            apps.forEach(a => {
                csvContent += `"${a.folio}","${a.nombre}","${a.matricula}","${a.carrera}","${a.cuatri}","${a.promedio}","${a.beca}","${a.status}","${a.fecha}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `padron_becas_unipol_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    renderAdminTable();

    /* ==========================================================================
       8. MODAL CONTROLLER
       ========================================================================== */
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalContent = document.getElementById('modalContent');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    function showBecaModal(beca) {
        if (!modalBackdrop || !modalContent) return;

        modalContent.innerHTML = `
            <div class="modal-header">
                <span class="beca-type-tag">${beca.badge}</span>
                <h2>${beca.icon} ${beca.title}</h2>
            </div>
            <div class="modal-body my-3">
                <p class="text-muted mb-3">${beca.desc}</p>
                <div class="beca-benefit-box">
                    <div class="benefit-icon">🎁</div>
                    <div class="benefit-info">
                        <small>Monto / Apoyo</small>
                        <strong>${beca.benefit}</strong>
                    </div>
                </div>
                <h4 class="mt-4 mb-2">Requisitos Generales:</h4>
                <ul class="beca-req-list">
                    ${beca.reqs.map(r => `<li class="beca-req-item">${r}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-footer mt-4">
                <a href="#solicitar" class="btn btn-primary w-100 modal-apply-btn" onclick="document.getElementById('modalBackdrop').classList.add('hidden')">
                    Solicitar esta Beca Ahora
                </a>
            </div>
        `;

        modalBackdrop.classList.remove('hidden');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modalBackdrop.classList.add('hidden');
        });
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.add('hidden');
            }
        });
    }
});
