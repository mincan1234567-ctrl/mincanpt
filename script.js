const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const sidebar = $("#sidebar");
const modal = $("#modal");
const modalBody = $("#modalBody");
const modalTitle = $("#modalTitle");
const toast = $("#toast");
const input = $("#prompt");
const chats = $("#chatList");

const state = {
  notice: "",
  features: {
    "웹사이트 만들기": true,
    "사진 만들기": true,
    "영상 만들기": true,
    "PPT 만들기": true,
    "동영상 편집": true,
    "사진 편집": true,
    "마인크래프트 모드 만들기": true,
    "물건 고장 분석": true
  }
};

function notify(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openMinecraftBuilder() {
  openModal("🎮 마인크래프트 모드 만들기", `
    <p>먼저 에디션을 선택하세요.</p>
    <div class="edition-grid">
      <button class="edition" id="bedrock">🟩<b>Bedrock Edition</b><small>애드온 / 행동팩 / 리소스팩</small></button>
      <button class="edition" id="java">🟧<b>Java Edition</b><small>Fabric / Forge / NeoForge</small></button>
    </div>
    <div id="loaderArea"></div>
  `);
  $("#bedrock").onclick = () => {
    $("#loaderArea").innerHTML = `<h3>Bedrock 버전</h3><select id="mcver"><option>1.21.x</option><option>1.20.x</option></select><button class="action" id="mcNext">다음</button>`;
    $("#mcNext").onclick = () => openMinecraftPrompt("Bedrock Edition", $("#mcver").value, "애드온");
  };
  $("#java").onclick = () => {
    $("#loaderArea").innerHTML = `<h3>Java 버전 / 로더</h3><select id="mcver"><option>1.21.x</option><option>1.20.x</option></select><select id="loader"><option>Fabric</option><option>Forge</option><option>NeoForge</option></select><button class="action" id="mcNext">다음</button>`;
    $("#mcNext").onclick = () => openMinecraftPrompt("Java Edition", $("#mcver").value, $("#loader").value);
  };
}
function openMinecraftPrompt(edition, version, loader) {
  openModal("모드 제작 설정", `<p><b>${edition}</b> · ${version} · ${loader}</p><input id="mcIdea" placeholder="예: 새로운 광물을 추가해줘"><button class="action" id="mcMake">만들기</button>`);
  $("#mcMake").onclick = () => {
    const idea = $("#mcIdea").value.trim();
    if (!idea) { notify("만들고 싶은 모드 내용을 입력해주세요."); return; }
    openModal("미리보기", `<p>🎮 ${edition} · ${version} · ${loader}</p><p>${escapeHtml(idea)}</p><div class="preview">모드 프로젝트 미리보기 준비 완료</div><button class="action" onclick="notify('프로젝트 생성 준비 완료')">프로젝트 만들기</button>`);
  };
}

function feature(name) {
  if (name === "마인크래프트 모드 만들기") { openMinecraftBuilder(); return; }
  if (name === "인기") {
    input.value = "";
    input.focus();
    notify("인기 기능을 골라보세요.");
    return;
  }
  if (state.features[name] === false) {
    notify(`${name} 기능이 현재 전체 OFF 상태입니다.`);
    return;
  }
  input.value = `${name} 시작해줘`;
  input.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function send() {
  const text = input.value.trim();
  if (!text) {
    notify("내용을 입력해주세요.");
    input.focus();
    return;
  }

  const item = document.createElement("button");
  item.className = "chat";
  item.innerHTML = `💬 ${escapeHtml(text)}<small>방금 전</small>`;
  item.addEventListener("click", () => {
    input.value = text;
    input.focus();
  });
  chats.prepend(item);
  input.value = "";
  notify("새 대화를 만들었습니다.");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function adminPanel() {
  const rows = Object.entries(state.features).map(([name, enabled]) => `
    <div class="admin-row">
      <span>${escapeHtml(name)}</span>
      <button class="toggle ${enabled ? "on" : ""}" data-toggle="${escapeHtml(name)}">
        ${enabled ? "ON" : "OFF"}
      </button>
    </div>
  `).join("");

  openModal("민찬피티 관리자 모드", `
    <h3>📊 운영 대시보드</h3>
    <div class="admin-grid">
      <div><b>오늘 방문자</b><strong id="todayUsers">-</strong></div>
      <div><b>전체 사용자</b><strong id="totalUsers">-</strong></div>
      <div><b>공지</b><strong>${state.notice ? "게시 중" : "없음"}</strong></div>
      <div><b>크레딧</b><strong>사용 안 함</strong></div>
    </div>
    <h3>🛠 기능별 전체 제한</h3>
    <p class="muted">사용자별 제한은 없습니다. OFF로 바꾸면 해당 기능이 전체 사용자에게 제한됩니다.</p>
    <div class="admin-list">${rows}</div>
    <h3>📢 전체 공지</h3>
    <input id="noticeText" value="${escapeHtml(state.notice)}" placeholder="전체 사용자에게 보낼 공지">
    <div class="admin-actions">
      <button class="action" id="saveNotice">공지하기</button>
      <button class="action secondary" id="removeNotice">공지 내리기</button>
    </div>
    <h3>🧪 관리</h3>
    <div class="admin-actions">
      <button class="action secondary" id="showUsers">사용자 관리</button>
      <button class="action secondary" id="siteStatus">사이트 상태</button>
    </div>
  `);

  // Demo dashboard values; real production values should come from a server/database.
  $("#todayUsers").textContent = "연결 후 집계";
  $("#totalUsers").textContent = "연결 후 집계";

  $$("[data-toggle]").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.toggle;
      state.features[name] = !state.features[name];
      adminPanel();
      notify(`${name} ${state.features[name] ? "ON" : "OFF"}`);
    };
  });

  $("#saveNotice").onclick = () => {
    state.notice = $("#noticeText").value.trim();
    notify(state.notice ? "전체 공지를 게시했습니다." : "공지 내용을 입력해주세요.");
    adminPanel();
  };

  $("#removeNotice").onclick = () => {
    state.notice = "";
    notify("전체 공지를 내렸습니다.");
    adminPanel();
  };

  $("#showUsers").onclick = () => openModal("사용자 관리", `
    <p>사용자 목록, 계정 정지/복구, 계정 삭제 기능을 연결할 수 있습니다.</p>
    <p class="muted">실서비스에서는 인증 서버와 데이터베이스를 연결해야 실제 사용자 데이터가 표시됩니다.</p>
  `);

  $("#siteStatus").onclick = () => openModal("사이트 상태", `
    <p>민찬피티 프론트엔드: 정상</p>
    <p>AI API: 서버 연결 후 표시</p>
    <p>배포: Vercel/GitHub 연결 후 표시</p>
  `);
}

$("#sideOpen").onclick = () => sidebar.classList.add("open");
$("#sideClose").onclick = () => sidebar.classList.remove("open");
$("#send").onclick = send;
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

$("#newChat").onclick = () => {
  input.value = "";
  input.focus();
  notify("새 대화를 시작했습니다.");
};

$("#modalClose").onclick = closeModal;
modal.onclick = (e) => {
  if (e.target === modal) closeModal();
};

$("#creator").onclick = () => openModal("제작자 인증", `
  <p>제작자 전용 인증을 진행합니다.</p>
  <input id="creatorEmail" type="email" placeholder="제작자 이메일">
  <input id="creator2fa" inputmode="numeric" placeholder="2단계 인증번호">
  <button class="action" id="creatorLogin">인증하기</button>
  <small class="muted">실서비스에서는 이메일과 인증번호를 코드에 저장하지 말고 서버 인증/환경변수로 보호하세요.</small>
`);

document.addEventListener("click", (e) => {
  if (e.target.id === "creatorLogin") {
    const email = $("#creatorEmail").value.trim();
    const code = $("#creator2fa").value.trim();

    if (!email || !code) {
      notify("이메일과 2단계 인증번호를 입력해주세요.");
      return;
    }

    // UI-only demo authentication. Real verification must happen server-side.
    adminPanel();
  }
});

$$("[data-feature]").forEach((el) => {
  el.addEventListener("click", () => feature(el.dataset.feature));
});

$$(".card button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    feature(btn.closest(".card").dataset.feature);
  });
});

$$("[data-go]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.go;
    if (target === "settings") {
      openModal("설정", "<p>테마, 알림, 계정 설정을 이곳에 연결할 수 있습니다.</p>");
    } else if (target === "help") {
      openModal("도움말", "<p>원하는 기능을 누르거나 입력창에 원하는 작업을 적어보세요.</p>");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});
