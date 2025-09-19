// API基础URL配置
const getApiBaseUrl = () => {
    if (typeof process !== 'undefined' && process.env.VITE_API_URL) {
        return process.env.VITE_API_URL;
    }
    
    if (window.ENV && window.ENV.API_URL) {
        return window.ENV.API_URL;
    }
    
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    return isProduction 
        ? 'https://your-backend.up.railway.app'
        : 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// 模拟数据存储
let projects = JSON.parse(localStorage.getItem('arProjects')) || [];
let currentStream = null;

// DOM元素
const startCameraBtn = document.getElementById('start-camera');
const createProjectBtn = document.getElementById('create-project');
const helpBtn = document.getElementById('help-btn');
const backBtn = document.getElementById('back-btn');
const cameraPreview = document.getElementById('camera-preview');
const projectsContainer = document.getElementById('projects-container');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupMobileControls();
    setupModal();
    setupCamera();
    renderProjects();
    checkDeviceAndEnvironment();
});

// 移动端触摸支持
function setupMobileControls() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.style.webkitTapHighlightColor = 'transparent';
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.8';
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            this.style.opacity = '1';
            this.click();
        });
        
        button.addEventListener('touchcancel', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            this.style.opacity = '1';
        });
    });
}

// 模态框控制
function setupModal() {
    const modal = document.getElementById('help-modal');
    const closeBtn = document.querySelector('.close');
    
    if (helpBtn && modal && closeBtn) {
        helpBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// 相机控制
function setupCamera() {
    if (startCameraBtn && cameraPreview) {
        startCameraBtn.addEventListener('click', async function() {
            if (window.location.hostname.includes('netlify.app')) {
                showNotification('📱 请在手机浏览器中访问以获得完整相机功能', 'info');
                return;
            }
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                showNotification('您的浏览器不支持相机功能', 'error');
                return;
            }
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });
                
                cameraPreview.srcObject = stream;
                currentStream = stream;
                startCameraBtn.textContent = '关闭相机';
                startCameraBtn.onclick = stopCamera;
                
                const guide = document.querySelector('.camera-guide');
                if (guide) guide.style.display = 'none';
                
            } catch (error) {
                handleCameraError(error);
            }
        });
    }
}

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    cameraPreview.srcObject = null;
    startCameraBtn.textContent = '开启相机';
    startCameraBtn.onclick = () => setupCamera();
    
    const guide = document.querySelector('.camera-guide');
    if (guide) guide.style.display = 'block';
}

function handleCameraError(error) {
    let message = '无法访问相机';
    
    const errors = {
        'NotAllowedError': '相机权限被拒绝，请允许权限并刷新页面',
        'NotFoundError': '未找到可用的相机设备',
        'NotReadableError': '相机设备正被其他程序使用',
        'OverconstrainedError': '无法满足相机配置要求',
        'SecurityError': '相机访问被浏览器安全策略阻止',
        'TypeError': '访问相机需要HTTPS协议'
    };
    
    showNotification(errors[error.name] || message, 'error');
}

// 设备检测
function checkDeviceAndEnvironment() {
    const isNetlify = window.location.hostname.includes('netlify.app');
    const isLocalhost = window.location.hostname === 'localhost';
    const isHTTPS = window.location.protocol === 'https:';
    
    if (isNetlify) {
        showNotification('📱 建议在手机浏览器中获得最佳体验', 'info');
    }
    
    if (!isHTTPS && !isLocalhost) {
        showNotification('⚠️ 相机功能需要HTTPS安全连接', 'error');
    }
}

// 返回欢迎页面
window.goToWelcome = function() {
    window.location.href = 'welcome.html';
};

// 创建项目
if (createProjectBtn) {
    createProjectBtn.addEventListener('click', function() {
        showNotification('🎨 创建项目功能准备中...', 'info');
    });
}

// 渲染项目
function renderProjects() {
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '';
    
    if (projects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="project-card">
                <h3>暂无项目</h3>
                <p>点击"创建新项目"开始您的AR之旅</p>
            </div>
        `;
        return;
    }
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}" style="max-width:100%; border-radius:8px;">
            </div>
            <p>创建时间: ${project.createdAt}</p>
            <p>状态: <span class="status">${project.status}</span></p>
            <div class="project-actions">
                <button class="view-btn" onclick="viewProject(${project.id})">
                    👁️ 查看详情
                </button>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

// 查看项目
window.viewProject = function(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        const viewModal = document.createElement('div');
        viewModal.className = 'modal';
        viewModal.style.display = 'block';
        viewModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${project.name}</h2>
                <div style="text-align:center; margin:20px 0;">
                    <img src="${project.image}" alt="项目图片" style="max-width:100%; max-height:300px; border-radius:10px;">
                </div>
                <p><strong>创建时间:</strong> ${project.createdAt}</p>
                <p><strong>状态:</strong> ${project.status}</p>
                <div style="text-align:center; margin-top:20px;">
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        关闭
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewModal);
        document.body.style.overflow = 'hidden';
        
        const closeBtn = viewModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                viewModal.remove();
                document.body.style.overflow = 'auto';
            });
        }
        
        viewModal.addEventListener('click', (e) => {
            if (e.target === viewModal) {
                viewModal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }
};

// 通知系统
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:inherit; cursor:pointer; margin-left:10px;">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 250px;
        max-width: 350px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const colors = {
        success: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
        error: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
        info: 'linear-gradient(45deg, #4e54c8, #8f94fb)'
    };
    
    notification.style.background = colors[type] || colors.success;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    showNotification('发生了一些错误，请刷新页面重试', 'error');
});

window.addEventListener('online', function() {
    showNotification('网络连接已恢复');
});

window.addEventListener('offline', function() {
    showNotification('网络连接已断开，使用本地模式', 'error');
});

// 导出全局函数
window.showNotification = showNotification;
window.viewProject = viewProject;
window.goToWelcome = goToWelcome;
