/** @format */
// todo: bind the querySelector for $,$$ with document context
let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

// todo: query the element from DOM
const player = $(".player");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const playList = $(".playlist");
const heading = $("header h2");
const cdThump = $(".cd-thumb");
const audio = $("#audio");
const togglePlay = $(".btn-toggle-play");
const progress = $("#progress");
const repeatBtn = $(".btn-repeat");
const previousBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const playlist = $(".playlist");

// todo: KEY which save on local storage,this key of our config
const PLAYER_STORAGE_KEY = "MY_PLAYER";

// todo: main object of our app
const app = {
	currentIndex: 0,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

	// TODO : To set config of app by take the key config from local storage (this saved by the previous play)
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},

	// todo : save the list of song
	songs: [
		{
			name: "Binh Yen",
			singer: "Buc Tuong",
			path: "./assets/mp3/BinhYen.mp3",
			image: "./assets/img/BT1.jpeg",
		},
		{
			name: "Buoc Qua Mua Co Don",
			singer: "Vu",
			path: "./assets/mp3/BuocQuaMuaCoDon.mp3",
			image: "./assets/img/Vu.jpg",
		},
		{
			name: "Con Duong Khong ten",
			singer: "Buc Tuong",
			path: "./assets/mp3/ConDuongKhongTen.mp3",
			image: "./assets/img/BT2.jpg",
		},
		{
			name: "DeVuong",
			singer: "Trinh Dinh Dung",
			path: "./assets/mp3/DeVuong.mp3",
			image: "./assets/img/Dinhdung.jpg",
		},
		{
			name: "Giac Mo Chi La Giac Mo",
			singer: "Ha Anh Tuan",
			path: "./assets/mp3/GiacMoChiLaGiacMo.mp3",
			image: "./assets/img/HAT1.jpg",
		},
		{
			name: "Hen Uoc Tu Hu Vo",
			singer: "My Tam",
			path: "./assets/mp3/Hen Uoc Tu Hu Vo.mp3",
			image: "./assets/img/MT.jpg",
		},
		{
			name: "Ly Cafe Khong Duong",
			singer: "Buc Tuong",
			path: "./assets/mp3/LyCafeKhongDuong.mp3",
			image: "./assets/img/BT3.jpg",
		},
		{
			name: "See Tinh",
			singer: "Hoang Thuy Linh",
			path: "./assets/mp3/SeeTinh.mp3",
			image: "./assets/img/HTL.jpg",
		},
		{
			name: "Tuoi Be Tho",
			singer: "Buc Tuong",
			path: "./assets/mp3/TuoiBeTho-BucTuong.mp3",
			image: "./assets/img/BT4.jpg",
		},
		{
			name: "Uoc Muon",
			singer: "Buc Tuong",
			path: "./assets/mp3/UocMuon.mp3",
			image: "./assets/img/BT5.jpg",
		},
	],

	// todo : render playlist from songs object of app to UI
	render: function () {
		const htmls = this.songs.map((song, index) => {
			return `<div data-index="${index}" class="song ${
				index === this.currentIndex ? "active" : ""
			}">
					<div
						class="thumb"
						style="
							background-image: url(${song.image});
						"
					></div>
					<div class="body">
						<h3 class="title">${song.name}</h3>
						<p class="author">${song.singer}</p>
					</div>
					<div class="option">
						<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>`;
		});
		playList.innerHTML = htmls.join("");
	},

	// todo: to define the currentSong property that belongs to the app object it's value is result of each song by current index
	defineProperties: function () {
		Object.defineProperty(this, "currentSong", {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},
	// todo: handle all the event it fires on the app
	handleEvent: function () {
		const _this = this;

		//todo: handle scroll event
		document.onscroll = function () {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const newCdWidth = cdWidth - scrollTop;
			cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
			cd.style.opacity = newCdWidth > 0 ? newCdWidth / cdWidth : 0;
		};

		// TODO: handle audio play and change progress AND display it to the value of of range input
		audio.ontimeupdate = function () {
			let progressPercentage = 0;
			if (audio.duration) {
				progressPercentage = 100 * (audio.currentTime / audio.duration);
			}
			progress.value = progressPercentage;
		};

		//todo: make CD Thump rotation
		let cdThumpAnimation = cdThump.animate(
			{ transform: "rotate(360deg)" },
			{ duration: 10000, iterations: Infinity }
		);
		cdThumpAnimation.pause();

		//todo: handle play and pause audio
		togglePlay.onclick = function (e) {
			if (audio.paused) {
				player.classList.add("playing");
				audio.play();
				cdThumpAnimation.play();
			} else {
				player.classList.remove("playing");
				audio.pause();
				cdThumpAnimation.pause();
			}
		};

		//todo: handle change time of audio by change the value of input range which represent for percentage of the playing time on length of audio
		progress.onchange = function (e) {
			let seekTime = (e.target.value * audio.duration) / 100;
			audio.currentTime = seekTime;
		};

		// TODO:Listen click event on next button and then decide whether it needs to move to the immediate next to song or a random song
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.nextSong();
			}
			if (audio.paused) {
				player.classList.add("playing");
				audio.play();
				cdThumpAnimation.play();
			}
			_this.render();
			_this.scrollToActiveSong();
		};

		// TODO:Listen click event on previous button and then decide whether it needs to move to the immediate previous song or a random song
		previousBtn.onclick = function () {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.preSong();
			}
			if (audio.paused) {
				player.classList.add("playing");
				audio.play();
				cdThumpAnimation.play();
			}
			_this.render();
			_this.scrollToActiveSong();
		};

		// TODO : listen event on repeat button and assign it to a handler on which will save it's state to config property
		randomBtn.onclick = function () {
			_this.isRandom = !_this.isRandom;
			_this.setConfig("isRandom", _this.isRandom);
			randomBtn.classList.toggle("active", _this.isRandom);
		};

		// TODO : listen event on repeat button and assign it to a handler on which will save it's state to config property
		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig("isRepeat", _this.isRepeat);
			repeatBtn.classList.toggle("active", _this.isRepeat);
		};

		// TODO: TO listen event when song end and after that decide whether play again that song or next to the other song
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play();
			} else if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.nextSong();
			}
			if (audio.paused) {
				player.classList.add("playing");
				audio.play();
				cdThumpAnimation.play();
			}
			_this.render();
			_this.scrollToActiveSong();
		};

		//TODO:listen event on playlist and play the song,render again playlist to make chosen song active
		playlist.onclick = function (e) {
			const clickedSong = e.target.closest(".song:not(.active)");
			if (clickedSong || e.target.closest(".option")) {
				//handle when click on song
				if (clickedSong && !e.target.closest(".option")) {
					const indexSong = clickedSong.dataset.index;
					_this.currentIndex = Number(indexSong);
					_this.loadCurrentSong();
					if (audio.paused) {
						player.classList.add("playing");
						audio.play();
						cdThumpAnimation.play();
					}
					_this.render();
				}
			}
		};
	},

	// todo: load current playing song into our  dashboard UI
	loadCurrentSong: function () {
		cdThump.style.backgroundImage = `url("${this.currentSong.image}")`;
		heading.innerText = this.currentSong.name;
		audio.src = this.currentSong.path;
	},

	//todo: load our config for control from local storage that saved in the previous play time
	loadConfig: function () {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
		randomBtn.classList.toggle("active", this.isRandom);
		repeatBtn.classList.toggle("active", this.isRepeat);
	},

	// todo: move our playing song to the next to song
	nextSong: function () {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},

	// todo: move the playing song backward
	preSong: function () {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length;
		}
		this.loadCurrentSong();
	},

	// todo: handle assign the playing song to a random song in our storage
	playRandomSong: function () {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while (this.currentIndex === newIndex);
		this.currentIndex = newIndex;
		this.loadCurrentSong();
	},

	// todo: handle when the song is overflow from this view , this function will scroll to make it appearance
	scrollToActiveSong: function () {
		setTimeout(function () {
			$(".song.active").scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
		}, 500);
	},
	// todo : to start our app
	start: function () {
		//TODO: load config for the app when refresh
		this.loadConfig();
		//TODO: define properties
		this.defineProperties();
		//TODO: listen event and handleEvent
		this.handleEvent();
		//tODO: load current first Song into UI when app starts
		this.loadCurrentSong();
		//TODO: redder song list
		this.render();
	},
};

// TODO : Start Music Player App
app.start();
