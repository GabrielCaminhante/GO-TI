document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualiza dinamicamente o ano no rodapé
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Lógica do Modal de Aceite para o Pacote Office
    const btnOpenModal = document.getElementById('btnOpenOfficeModal');
    const btnCloseModal = document.getElementById('btnCloseOfficeModal');
    const modal = document.getElementById('officeModal');
    const chkTerms = document.getElementById('chkAcceptTerms');
    const btnConfirm = document.getElementById('btnConfirmDownload');

    if (btnOpenModal && modal) {
        // Abrir Modal
        btnOpenModal.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Fechar Modal no "X"
        btnCloseModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Fechar Modal ao clicar fora dele
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Habilitar/Desabilitar o botão de acordo com a checkbox
        chkTerms.addEventListener('change', () => {
            if (chkTerms.checked) {
                btnConfirm.classList.remove('btn-disabled');
            } else {
                btnConfirm.classList.add('btn-disabled');
            }
        });
    }

    // 3. Animação dos Circuitos Elétricos Convergindo para o Meio
    const canvas = document.getElementById('circuitCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let pulses = [];

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.clientWidth;
            canvas.height = hero.clientHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Pulse {
            constructor(x, y, dx, dy, life, isBranch = false) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.life = life;
                this.maxLife = life;
                this.history = [{ x: this.x, y: this.y }];
                this.isBranch = isBranch;
                this.reachedCenter = false;
            }

            update() {
                const targetX = canvas.width / 2;
                const targetY = canvas.height / 2;

                this.x += this.dx;
                this.y += this.dy;
                this.history.push({ x: this.x, y: this.y });

                if (this.history.length > 25) {
                    this.history.shift();
                }

                this.life--;

                const distToCenter = Math.hypot(this.x - targetX, this.y - targetY);
                if (distToCenter < 30 && !this.reachedCenter) {
                    this.reachedCenter = true;
                    this.life = Math.min(this.life, 12);
                }

                if (!this.reachedCenter && Math.random() < 0.05 && this.life > 15) {
                    if (this.dx !== 0) {
                        const speed = Math.abs(this.dx);
                        this.dy = this.y < targetY ? speed : -speed;
                        this.dx = 0;
                    } else {
                        const speed = Math.abs(this.dy);
                        this.dx = this.x < targetX ? speed : -speed;
                        this.dy = 0;
                    }
                }

                if (!this.isBranch && !this.reachedCenter && Math.random() < 0.025 && this.life > 20) {
                    const bDx = this.dx !== 0 ? 0 : (this.x < targetX ? 2 : -2);
                    const bDy = this.dy !== 0 ? 0 : (this.y < targetY ? 2 : -2);
                    pulses.push(new Pulse(this.x, this.y, bDx, bDy, Math.floor(this.life * 0.7), true));
                }
            }

            draw() {
                if (this.history.length < 2) return;

                ctx.beginPath();
                ctx.moveTo(this.history[0].x, this.history[0].y);
                for (let i = 1; i < this.history.length; i++) {
                    ctx.lineTo(this.history[i].x, this.history[i].y);
                }

                const alpha = Math.min(1, this.life / 20);
                ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
                ctx.lineWidth = this.isBranch ? 1.5 : 2.5;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#38bdf8';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.reachedCenter ? 4 : (this.isBranch ? 2 : 3), 0, Math.PI * 2);
                ctx.fillStyle = this.reachedCenter ? '#38bdf8' : '#ffffff';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#ffffff';
                ctx.fill();
            }
        }

        function spawnPulse() {
            if (pulses.length > 14) return;

            const side = Math.random();
            let x, y, dx, dy;
            const speed = 1.8 + Math.random() * 1.2;

            if (side < 0.35) {
                x = 0;
                y = Math.random() * canvas.height;
                dx = speed;
                dy = 0;
            } else if (side < 0.7) {
                x = canvas.width;
                y = Math.random() * canvas.height;
                dx = -speed;
                dy = 0;
            } else if (side < 0.85) {
                x = Math.random() * canvas.width;
                y = 0;
                dx = 0;
                dy = speed;
            } else {
                x = Math.random() * canvas.width;
                y = canvas.height;
                dx = 0;
                dy = -speed;
            }

            pulses.push(new Pulse(x, y, dx, dy, 120 + Math.random() * 40));
        }

        setInterval(spawnPulse, 500);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.update();
                p.draw();

                if (p.life <= 0) {
                    pulses.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }
});